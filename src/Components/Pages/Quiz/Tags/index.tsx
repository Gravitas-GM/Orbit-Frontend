import * as React from 'react';
import {User, UserModel} from '../../../../Api/Hub/Models/Users';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {QuestionTag, QuestionTagModel} from '../../../../Api/Quiz/Models/QuestionTags';
import {toaster} from '../../../../toaster';
import {history} from '../../../../history';
import {DeleteDialog, DeleteSubject} from '../../../DeleteDialog';
import {ObjectList} from '../../../ObjectList';
import {Button, Checkbox, HTMLTable, Intent} from '@blueprintjs/core';
import {LinkButton} from '../../../LinkButton';
import {allSettled, isRejectedResult} from '../../../Utility/promise';

interface IState {
	tags: QuestionTag[];
	loading: boolean;
	users: User[];
	showDeleteDialog: boolean;
	selectedItems: QuestionTag[];
	deleteTargets: QuestionTag[];
	deleteSubject: string | undefined;
}

export class TagListPage extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: true,
		tags: [],
		users: [],
		showDeleteDialog: false,
		selectedItems: [],
		deleteTargets: [],
		deleteSubject: undefined,
	};

	public async componentDidMount() {
		let data: [QuestionTag[], User[]];

		try {
			data = await Promise.all([
				QuestionTagModel.list({
					_default: true,
					'members.id': true,
				}).then(r => r.data),
				UserModel.list().then(r => r.data),
			]);
		} catch (error) {
			toaster.showUnhandledErrorMessage();

			history.push('/');

			return;
		}

		const [tags, users] = data;

		this.setState({
			tags,
			users,
			loading: false,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<section className="gm-page-wrapper">
				<ObjectList
					title="Question Tags"
					items={this.state.tags}
					onItemFilter={this.onTagFilter}
					editorUrlPrefix="/quiz/tags"
					bulkDeleteDisabled={this.state.selectedItems.length === 0}
					onBulkDeleteClick={this.onBulkDeleteClick}
				>
					{items => (
						<HTMLTable striped={true}>
							<thead>
								<tr>
									<th>Label</th>
									<th style={{width: 250}}>Members</th>
									<th style={{textAlign: 'center', width: 100}}>Edit</th>
									<th style={{width: 100, textAlign: 'center'}}>Delete</th>
									<th style={{width: 100, textAlign: 'center'}}>
										<Checkbox
											className="gm-table-checkbox"
											checked={items.length > 0 && items.length === this.state.selectedItems.length}
											onClick={this.onSelectAllClick}
										/>
									</th>
								</tr>
							</thead>

							<tbody>
								{items.map(item => (
									<TableItem
										key={item.id}
										item={item}
										onDelete={this.onDeleteClick}
										onSelect={this.onSelectClick}
										isChecked={this.isChecked(item)}
									/>
								))}
							</tbody>
						</HTMLTable>
					)}
				</ObjectList>

				<DeleteDialog
					isOpen={this.state.deleteTargets.length > 0}
					multiple={this.state.deleteTargets.length > 1}
					onCancel={this.onDeleteDialogClose}
					onConfirm={this.onConfirmDelete}
					subject={this.state.deleteSubject}
				/>
			</section>
		);
	}

	private onDeleteClick = (tag: QuestionTag) => this.setState({
		deleteTargets: [tag],
		deleteSubject: tag.label,
	});

	private onBulkDeleteClick = () => this.setState(state => ({
		deleteTargets: state.selectedItems,
		deleteSubject: DeleteSubject.DELETE,
	}));

	private onDeleteDialogClose = () => this.setState({
		deleteTargets: [],
		deleteSubject: undefined,
	});

	private onConfirmDelete = async () => {
		if (this.state.deleteTargets.length === 0)
			return;

		const results = await allSettled(this.state.deleteTargets.map(async item => {
			 QuestionTagModel.delete(item.id)

			 return item
		}));

		let failureCount = 0;
		const deletedItems: QuestionTag[] = [];

		for (const result of results) {
			if (isRejectedResult(result)) {
				failureCount++;
				continue;
			}

			deletedItems.push(result.value);
		}

		if (failureCount > 0)
			toaster.showUnhandledErrorMessage();

		toaster.success(`Tag${ this.state.selectedItems.length > 1 ? 's' : ''} deleted successfully`);

		this.setState(state => ({
			tags: state.tags.filter(item => !deletedItems.includes(item)),
			selectedItems: state.selectedItems.filter(item => !deletedItems.includes(item)),
			deleteTargets: [],
		}));
	};

	private onTagFilter = (tag: QuestionTag, searchText: string) => tag.label.toLocaleLowerCase().includes(searchText);

	private isChecked = (item: QuestionTag) => this.state.selectedItems.includes(item);

	private isAllChecked = () => this.state.selectedItems.length === this.state.tags.length;

	private onSelectAllClick = () => {
		if (this.isAllChecked()) {
			this.setState({
				selectedItems: [],
			});
		} else {
			this.setState( state => ({
				selectedItems: [...state.tags],
			}));
		}
	};

	private onSelectClick = (item: QuestionTag) => {
		if (this.state.selectedItems.includes(item))
			this.setState(state => ({
				selectedItems: state.selectedItems.filter(selectedItem => selectedItem !== item),
			}));
		else
			this.setState(state => ({
				selectedItems: [...state.selectedItems, item],
			}));
	};
}

interface TableItemProps {
	item: QuestionTag;
	onDelete: (item: QuestionTag) => void;
	onSelect: (item: QuestionTag) => void;
	isChecked: boolean;
}

const TableItem: React.FC<TableItemProps> = ({item, onDelete, onSelect, isChecked}) => {
	const onDeleteButtonClick = React.useCallback(() => {
		onDelete(item);
	}, [item, onDelete]);

	const onSelectButtonClick = React.useCallback(() => {
		onSelect(item);
	}, [item, onSelect]);

	return (
		<tr>
			<td>{item.label}</td>

			<td>
				{item.members.length} Member{item.members.length !== 1 ? 's' : ''}
			</td>

			<td style={{textAlign: 'center'}}>
				<LinkButton to={`/quiz/tags/${item.id}`} icon="edit" minimal={true} />
			</td>

			<td style={{textAlign: 'center'}}>
				<Button
					icon="delete"
					intent={Intent.DANGER}
					onClick={onDeleteButtonClick} minimal={true}
				/>
			</td>

			<td style={{textAlign: 'center'}}>
				<Checkbox
					className="gm-table-checkbox"
					checked={isChecked}
					onClick={onSelectButtonClick}
				/>
			</td>
		</tr>
	);
};
