import * as React from 'react';
import {Button, H2} from '@blueprintjs/core';
import {User} from '../../../../Api/Hub/Models/Users';
import {QuestionTag, QuestionTagModel} from '../../../../Api/Quiz/Models/QuestionTags';
import {Classes} from '../../../../classes';
import {UserContext} from '../../../../Session';
import {toaster} from '../../../../toaster';
import {DeleteDialog} from '../../../DeleteDialog';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {allSettled, isRejectedResult} from '../../../Utility/promise';
import {TagsTable, TagsTableRow} from './TagsTable';

interface IProps {
	user: User;
}

interface IState {
	loading: boolean;
	processing: boolean;
	deleteSubject: string | undefined;
	deleteTargets: QuestionTag[];
	showAddTagDialog: boolean;
	showDeleteDialog: boolean;
	tags: QuestionTag[];
	selectedItems: QuestionTag[];
	assignedTags: QuestionTag[];
}

export class QuizTab extends React.PureComponent<IProps, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		loading: true,
		processing: false,
		deleteSubject: undefined,
		deleteTargets: [],
		showAddTagDialog: false,
		showDeleteDialog: false,
		tags: [],
		selectedItems: [],
		assignedTags: [],
	};

	public async componentDidMount() {
		let tags: QuestionTag[] = [];

		try {
			tags = await QuestionTagModel.list({_default: true, 'members.id': true}).then(r => r.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();
		}

		let assignedTags: QuestionTag[] = [];

		for (const tag of tags) {
			if (tag.members.find(member => member.id === this.props.user.id))
				assignedTags.push(tag);
		}

		this.setState({
			tags,
			assignedTags,
			loading: false,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<div className={Classes.PAGE_WRAPPER}>
				<div className="settings-title-container">
					<H2>Tags</H2>

					<Button
						text="Delete Selected"
						icon="delete"
						intent="danger"
						onClick={this.onBulkDeleteButtonClick}
						disabled={this.state.selectedItems.length === 0}
					/>

					<Button
						text="Add Tag"
						icon="plus"
						intent="primary"
						onClick={this.onAddTagClick}
					/>
				</div>

				<TagsTable
					onAddTagClick={this.onAddTagClick}
					onSelectAll={this.onSelectAll}
					allSelected={this.isAllChecked()}
				>
					{this.state.assignedTags?.map(item => (
						<TagsTableRow
							key={item.id}
							item={item}
							onDelete={this.onBeginDeleteButtonClick}
							isChecked={this.isChecked(item)}
							onSelect={this.onSelect}
						/>
					))}
				</TagsTable>

				<DeleteDialog
					isOpen={this.state.showDeleteDialog}
					subject={this.state.deleteSubject}
					onConfirm={this.onDeleteConfirm}
					onCancel={this.onDeleteCancel}
					multiple={this.state.selectedItems.length > 1}
				/>

				{this.state.showAddTagDialog && (
					<>
						{/*TODO: Create Add Tag dialog*/}
					</>
				)}
			</div>
		);
	}

	private onAddTagClick = () => this.setState({
		showAddTagDialog: true,
	});

	private onAddTagDialogClose = () => this.setState({
		showAddTagDialog: false,
	});

	private onAddTagDialogSubmit = async (questionTag: QuestionTag) => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		//TODO: assign tag to user

		this.setState({
			processing: false,
			showAddTagDialog: false,
		});
	};

	private onBulkDeleteButtonClick = () => this.setState({
		deleteSubject: 'Delete',
		showDeleteDialog: true,
		deleteTargets: this.state.selectedItems,
	});

	private onBeginDeleteButtonClick = (items: QuestionTag[]) => {
		this.setState({
			deleteSubject: items[0].label,
			deleteTargets: items,
			showDeleteDialog: true,
		});
	};

	private onDeleteCancel = () => this.setState({
		showDeleteDialog: false,
	});

	private onDeleteConfirm = async () => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		const results = await allSettled(this.state.deleteTargets.map(async item => {
			const memberIds = item.members.filter(user => user.id !== this.props.user.id).map(user => user.id);

			await QuestionTagModel.update(item.id, {members: memberIds});

			return item;
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

		this.setState(state => (
			{
				assignedTags: state.assignedTags.filter(item => !deletedItems.includes(item)),
				selectedItems: [],
				deleteTargets: [],
				deleteSubject: '',
				showDeleteDialog: false,
				processing: false,
			}
		));
	};

	private isChecked = (item: QuestionTag) => this.state.selectedItems.includes(item);

	private isAllChecked = () => this.state.selectedItems.length === this.state.assignedTags.length;

	private onSelect = (item: QuestionTag) => {
		if (this.isChecked(item)) {
			this.setState(state => (
				{selectedItems: state.selectedItems.filter(target => target !== item)}
			));
			return;
		}

		this.setState(state => (
			{
				selectedItems: [...state.selectedItems, item],
			}
		));
	};

	private onSelectAll = () => {
		if (this.isAllChecked()) {
			this.setState({
				selectedItems: [],
			});
		} else {
			this.setState({
				selectedItems: [...this.state.assignedTags],
			});
		}
	};
}
