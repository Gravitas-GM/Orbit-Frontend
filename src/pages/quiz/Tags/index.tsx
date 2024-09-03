import {Button, Checkbox, HTMLTable, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Navigate} from 'react-router-dom';
import {User, UserModel} from '../../../api/Hub/Models/Users';
import {QuestionTag, QuestionTagModel} from '../../../api/Quiz/Models/QuestionTags';
import {DeleteDialog, DeleteSubject} from '../../../components/DeleteDialog';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {LinkButton} from '../../../components/LinkButton';
import {ObjectList} from '../../../components/ObjectList';
import {Spacing} from '../../../Styles/variables';
import {toaster} from '../../../toaster';
import {allSettled, isRejectedResult} from '../../../utility/promise';

interface State {
	tags: QuestionTag[],
	loading: boolean,
	users: User[],
	showDeleteDialog: boolean,
	selectedItems: QuestionTag[],
	deleteTargets: QuestionTag[],
	deleteSubject: string | undefined,
	redirect: string | null,
}

export class TagListPage extends React.PureComponent<{}, State> {
	public state: Readonly<State> = {
		loading: true,
		tags: [],
		users: [],
		showDeleteDialog: false,
		selectedItems: [],
		deleteTargets: [],
		deleteSubject: undefined,
		redirect: null,
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

			this.setState({
				redirect: '/',
			});

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
		if (this.state.redirect)
			return <Navigate to={this.state.redirect} />;
		else if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<section className="gm-page-wrapper">
				<ObjectList
					title="Question Tags"
					editorUrlPrefix="/quiz/tags"
					items={this.state.tags}
					onItemFilter={this.onTagFilter}
					bulkDeleteDisabled={this.state.selectedItems.length === 0}
					onBulkDeleteClick={this.onBulkDeleteClick}
				>
					{items => (
						<HTMLTable striped={true}>
							<thead>
								<tr>
									<th
										style={{width: Spacing.XLarge}}
									>
										<Checkbox
											checked={this.isAllChecked()}
											onClick={this.onSelectAllClick}
										/>
									</th>

									<th>Label</th>
									<th style={{width: 250}}>Members</th>
									<th style={{textAlign: 'center', width: 100}}>Edit</th>
									<th style={{width: 100, textAlign: 'center'}}>Delete</th>
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
		deleteSubject: state.selectedItems.length > 1 ? DeleteSubject.DELETE : state.selectedItems[0].label,
	}));

	private onDeleteDialogClose = () => this.setState({
		deleteTargets: [],
		deleteSubject: undefined,
	});

	private onConfirmDelete = async () => {
		if (this.state.deleteTargets.length === 0)
			return;

		const results = await allSettled(
			this.state.deleteTargets.map(async item => {
				await QuestionTagModel.delete(item.id);

				return item;
			}),
		);

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

		toaster.success(`Tag${this.state.selectedItems.length > 1 ? 's' : ''} deleted successfully`);

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
			this.setState(state => ({
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
			<td>
				<Checkbox checked={isChecked} onClick={onSelectButtonClick} />
			</td>

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
					onClick={onDeleteButtonClick}
					minimal={true}
				/>
			</td>
		</tr>
	);
};
