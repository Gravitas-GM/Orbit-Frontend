import * as React from 'react';
import {User, UserModel} from '../../../../Api/Hub/Models/Users';
import {Question, QuestionModel} from '../../../../Api/Quiz/Models/Questions';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {replace} from '../../../Utility/array';
import {TagEditorDialog} from './TagEditorDialog';
import {
	QuestionTag,
	QuestionTagCreatePayload,
	QuestionTagModel,
	QuestionTagUpdatePayload,
} from '../../../../Api/Quiz/Models/QuestionTags';
import * as toaster from '../../../../Toaster';
import {history} from '../../../../history';
import {DeleteDialog} from '../../../DeleteDialog';
import {ObjectList} from '../../../ObjectList';
import {Button, HTMLTable} from '@blueprintjs/core';
import {LinkButton} from '../../../LinkButton';

interface IState {
	tags: QuestionTag[];
	activeTag: QuestionTag | null;
	loading: boolean;
	showEditDialog: boolean;
	showDeleteDialog: boolean;
	users: User[];
	questions: Question[];
}

export class TagListPage extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: true,
		tags: [],
		activeTag: null,
		showDeleteDialog: false,
		showEditDialog: false,
		users: [],
		questions: [],
	};

	public async componentDidMount() {
		let data: [QuestionTag[], User[], Question[]];

		try {
			data = await Promise.all([
				QuestionTagModel.list({
					_default: true,
					'members.id': true,
				}).then(r => r.data),
				UserModel.list().then(r => r.data),
				QuestionModel.list({
					_default: true,
					'tag.label': true,
				}).then(response => response.data),
			]);
		} catch (error) {
			toaster.showUnhandledErrorMessage();

			history.push('/');

			return;
		}

		const [tags, users, questions] = data;

		this.setState({
			tags,
			users,
			questions,
			loading: false,
		});
	};

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
									<TableItem key={item.id} item={item} onDelete={this.onTagDelete} />
								))}
							</tbody>
						</HTMLTable>
					)}
				</ObjectList>

				<TagEditorDialog
					isOpen={this.state.showEditDialog}
					onClose={this.onEditDialogClose}
					tag={this.state.showEditDialog ? this.state.activeTag : null}
					users={this.state.users}
					questions={this.state.questions}
					onSubmit={this.onSubmit}
				/>

				<DeleteDialog
					isOpen={this.state.showDeleteDialog}
					onCancel={this.onDeleteDialogClose}
					onConfirm={this.onConfirmDelete}
					subject={this.state.showDeleteDialog ? this.state.activeTag?.label : null}
				/>
			</section>
		);
	};

	private onAddNewClick = () => this.setState({
		showEditDialog: true,
	});

	private onTagDelete = (tag: QuestionTag) => this.setState({
		activeTag: tag,
		showDeleteDialog: true,
	});

	private onDeleteDialogClose = () => this.setState({
		activeTag: null,
		showDeleteDialog: false,
	});

	private onEditDialogClose = () => this.setState({
		activeTag: null,
		showEditDialog: false,
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

		this.setState(state => (
			{
				tags: state.tags.filter(item => item.id !== state.activeTag?.id),
				activeTag: null,
				showDeleteDialog: false,
			}
		));
	};

	private onSubmit = async (tag: QuestionTagCreatePayload | QuestionTagUpdatePayload) => {
		try {
			if (this.state.activeTag)
				await this.onTagUpdate(tag as QuestionTagUpdatePayload);
			else
				await this.onTagCreate(tag as QuestionTagCreatePayload);
		} catch (error) {
			throw error;
		}
	};

	private onTagUpdate = async (tag: QuestionTagUpdatePayload) => {
		const updated = await QuestionTagModel.update(this.state.activeTag!.id, tag).then(r => r.data);

		this.setState(state => ({
			tags: replace(state.tags, state.activeTag!, updated),
			activeTag: null,
			showEditDialog: false,
		}));
	};

	private onTagCreate = async (tag: QuestionTagCreatePayload) => {
		const newTag = await QuestionTagModel.create(tag).then(r => r.data);

		this.setState(state => ({
			tags: [...state.tags, newTag],
			showEditDialog: false,
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
			<td>{item.members.length} Member{item.members.length !== 1 ? 's' : ''}</td>
			<td>
				<LinkButton to={`/quiz/tags/${item.id}`} icon="edit" minimal={true} />
				<Button icon="trash" onClick={onDeleteButtonClick} minimal={true} />
			</td>
		</tr>
	);
};
