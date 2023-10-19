import * as React from 'react';
import {User, UserModel} from '../../../../Api/Hub/Models/Users';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {QuestionTag, QuestionTagModel} from '../../../../Api/Quiz/Models/QuestionTags';
import * as toaster from '../../../../Toaster';
import {history} from '../../../../history';
import {DeleteDialog} from '../../../DeleteDialog';
import {ObjectList} from '../../../ObjectList';
import {Button, HTMLTable} from '@blueprintjs/core';
import { LinkButton } from '../../../LinkButton';

interface IState {
	activeTag: QuestionTag | null;
	tags: QuestionTag[];
	loading: boolean;
	users: User[];
	showDeleteDialog: boolean;
}

export class TagListPage extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: true,
		tags: [],
		users: [],
		activeTag: null,
		showDeleteDialog: false,
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
					onAddNewClick={this.onAddNewClick}
				>
					{items => (
						<HTMLTable striped={true}>
							<thead>
								<tr>
									<th>Label</th>
									<th style={{width: 250}}>Members</th>
									<th style={{width: 100}}>Actions</th>
								</tr>
							</thead>

							<tbody>
								{items.map(item => (
									<TableItem
										key={item.id}
										item={item}
										onDelete={this.onTagDelete}
									/>
								))}
							</tbody>
						</HTMLTable>
					)}
				</ObjectList>

				<DeleteDialog
					isOpen={this.state.showDeleteDialog}
					onCancel={this.onDeleteDialogClose}
					onConfirm={this.onConfirmDelete}
					subject={this.state.showDeleteDialog ? this.state.activeTag?.label : null}
				/>
			</section>
		);
	}

	private onAddNewClick = () => history.push('/quiz/tags/new');

	private onTagDelete = (tag: QuestionTag) => this.setState({
		activeTag: tag,
		showDeleteDialog: true,
	});

	private onDeleteDialogClose = () => this.setState({
		activeTag: null,
		showDeleteDialog: false,
	});

	private onConfirmDelete = async () => {
		if (!this.state.activeTag)
			return;

		try {
			await QuestionTagModel.delete(this.state.activeTag.id);
		} catch (err) {
			this.setState({
				showDeleteDialog: false,
			});

			toaster.error('Failed to delete tag');

			return;
		}

		toaster.success(`Tag "${this.state.activeTag.label}" deleted successfully`);

		this.setState(state => ({
			tags: state.tags.filter(item => item.id !== state.activeTag?.id),
			activeTag: null,
			showDeleteDialog: false,
		}));
	};

	private onTagFilter = (tag: QuestionTag, searchText: string) => tag.label.toLocaleLowerCase().includes(searchText);
}

interface TableItemProps {
	item: QuestionTag;
	onDelete: (item: QuestionTag) => void;
}

const TableItem: React.FC<TableItemProps> = ({item, onDelete}) => {
	const onDeleteButtonClick = React.useCallback(() => {
		onDelete(item);
	}, [item, onDelete]);

	return (
		<tr>
			<td>{item.label}</td>

			<td>
				{item.members.length} Member{item.members.length !== 1 ? 's' : ''}
			</td>

			<td>
				<LinkButton to={`/quiz/tags/${item.id}`} icon="edit" minimal={true} />

				<Button icon="trash" onClick={onDeleteButtonClick} minimal={true} />
			</td>
		</tr>
	);
};
