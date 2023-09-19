import * as React from 'react';
import {User, UserModel} from '../../../../Api/Hub/Models/Users';
import {PageHeader} from '../../../PageHeader';
import {Button, InputGroup} from '@blueprintjs/core';
import {Spacing} from '../../../../Styles/variables';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {replace} from '../../../Utility/array';
import {TagEditorDialog} from './TagEditorDialog';
import {
	QuestionTagModel,
	QuestionTag,
	QuestionTagCreatePayload,
	QuestionTagUpdatePayload,
} from '../../../../Api/Quiz/Models/QuestionTags';
import * as toaster from '../../../../Toaster';
import {history} from '../../../../history';
import {RenderTableItems} from './RenderTableItems';
import {DeleteDialog} from '../../../DeleteDialog';

interface IState {
	tags: QuestionTag[];
	activeTag: QuestionTag | null;
	loading: boolean;
	processing: boolean;
	filteredTags: QuestionTag[] | null;
	currentPage: number;
	totalPages: number;
	showEditDialog: boolean;
	showDeleteDialog: boolean;
	users: User[];
}

const ITEMS_PER_PAGE = 10;

export class TagListPage extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: false,
		processing: false,
		tags: [],
		activeTag: null,
		filteredTags: null,
		currentPage: 1,
		totalPages: 1,
		showDeleteDialog: false,
		showEditDialog: false,
		users: [],
	};

	public async componentDidMount() {
		this.setState({
			loading: true,
		});

		let tags: QuestionTag[];

		try {
			tags = await QuestionTagModel.list({
				'_default': true,
				'members.id': true,
			}).then((res) => res.data);
		} catch (err) {
			toaster.error('Failed to fetch question tags');
			history.push('/');

			return;
		}

		this.setState({
			tags,
			totalPages: Math.max(1, Math.ceil(tags.length / ITEMS_PER_PAGE)),
		});

		try {
			this.setState({
				users: await UserModel.list().then(r => r.data),
			});
		} catch (err) {
			toaster.error('Failed to fetch users');
			history.push('/');

			return;
		}

		this.setState({
			loading: false,
		});
	};

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		const {
			currentPage,
			totalPages,
		} = this.state;

		const startIndex = (
			currentPage - 1
		) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		const currrentPageItems = (
			this.state.filteredTags ?? this.state.tags
		).slice(startIndex, endIndex);

		return (
			<section className="gm-page-wrapper">
				<PageHeader title="Tags">
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: Spacing.Large,
						}}
					>
						<InputGroup
							type="search"
							leftIcon="search"
							placeholder="Search tags"
							onChange={this.onSearchChange}
						/>

						<Button icon="add" onClick={this.onAddNewClick}>
							Add New
						</Button>
					</div>
				</PageHeader>

				<RenderTableItems
					items={currrentPageItems}
					editCallback={this.onEditClick}
					deleteCallback={this.onDeleteClick}
				/>

				{this.state.tags.length > ITEMS_PER_PAGE && (
					<div className="pagination-container">
						<Button disabled={this.state.currentPage === 1} onClick={this.onBackClick} icon="caret-left">
							Prev
						</Button>

						<span>
							{currentPage}/{totalPages}
						</span>

						<Button
							disabled={this.state.currentPage >= totalPages}
							onClick={this.onNextClick}
							rightIcon="caret-right"
						>
							Next
						</Button>
					</div>
				)}

				<TagEditorDialog
					isOpen={this.state.showEditDialog}
					onClose={this.onEditDialogClose}
					tag={this.state.showEditDialog ? this.state.activeTag : null}
					users={this.state.users}
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

	private onDeleteDialogClose = () => {
		this.setState({
			activeTag: null,
			showDeleteDialog: false,
		});
	};

	private onEditDialogClose = () => this.setState({
		activeTag: null,
		showEditDialog: false,
	});

	private onEditClick = (tag: QuestionTag) => this.setState({
		activeTag: tag,
		showEditDialog: true,
	});

	private onDeleteClick = (tag: QuestionTag) => this.setState({
		activeTag: tag,
		showDeleteDialog: true,
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

	private onNextClick = () => this.setState(state => (
		{
			currentPage: Math.min(state.totalPages, state.currentPage + 1),
		}
	));

	private onBackClick = () => this.setState(state => (
		{
			currentPage: Math.max(1, state.currentPage - 1),
		}
	));

	private onSubmit = async (tag: QuestionTagCreatePayload | QuestionTagUpdatePayload) => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		try {
			if (this.state.activeTag)
				await this.onTagUpdate(tag as QuestionTagUpdatePayload);
			else
				await this.onTagCreate(tag as QuestionTagCreatePayload);
		} catch (error) {
			throw error;
		} finally {
			this.setState({
				processing: false,
			});
		}
	};

	private onTagUpdate = async (tag: QuestionTagUpdatePayload) => {
		const updated = await QuestionTagModel.update(this.state.activeTag!.id, tag).then(r => r.data);

		this.setState(state => {
			let filteredTags = state.filteredTags;

			if (filteredTags !== null)
				filteredTags = replace(filteredTags, state.activeTag!, updated);

			return {
				tags: replace(state.tags, state.activeTag!, updated),
				filteredTags,
				activeTag: null,
				showEditDialog: false,
			};
		});
	};

	private onTagCreate = async (tag: QuestionTagCreatePayload) => {
		const newTag = await QuestionTagModel.create(tag).then(r => r.data);

		this.setState(state => (
			{
				tags: [...state.tags, newTag],
				showEditDialog: false,
			}
		));
	};

	private onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.currentTarget.value === '') {
			const totalPages = Math.ceil(this.state.tags.length / ITEMS_PER_PAGE);

			this.setState({
				filteredTags: null,
				currentPage: 1,
				totalPages,
			});

			return;
		}

		const filteredTags = this.state.tags.filter((tag) =>
			tag.label.toLocaleLowerCase().includes(event.currentTarget.value.toLocaleLowerCase()),
		);

		const totalPages = Math.ceil(filteredTags.length / ITEMS_PER_PAGE);

		this.setState({
			filteredTags,
			currentPage: 1,
			totalPages,
		});
	};
}