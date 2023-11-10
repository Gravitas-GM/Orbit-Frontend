import * as React from 'react';
import {Button, H2} from '@blueprintjs/core';
import {ApiError} from '../../../../Api/errors/rocket';
import {ValidationFailures} from '../../../../Api/errors/symfony';
import {User} from '../../../../Api/Hub/Models/Users';
import {PointItem, PointsModel, UserPoints} from '../../../../Api/Point-Tracking/Models/Points';
import {PointSourceItem, PointSourceModel} from '../../../../Api/Point-Tracking/Models/Sources';
import {Classes} from '../../../../classes';
import {UserContext} from '../../../../Session';
import {toaster} from '../../../../toaster';
import {DeleteDialog} from '../../../DeleteDialog';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {allSettled, isRejectedResult} from '../../../Utility/promise';
import {AddPointsDialog} from '../../_Users/AddPointsDialog';
import {PointsTable, PointsTableRow} from './PointsTable';

export type DialogPointItem = {
	pointValue: number;
	sourceName: string;
	description?: string;
};

interface IProps {
	user: User;
}

interface IState {
	loading: boolean;
	pointItems: PointItem[] | null;
	processing: boolean;
	showAddPointsDialog: boolean;
	sources: PointSourceItem[];
	selectedItems: PointItem[];
	deleteSubject: string | undefined;
	deleteTargets: PointItem[];
	showDeleteDialog: boolean;
	validationFailures: ValidationFailures | null;
}

export class PointsTab extends React.PureComponent<IProps, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		loading: true,
		processing: false,
		showAddPointsDialog: false,
		selectedItems: [],
		deleteSubject: undefined,
		deleteTargets: [],
		showDeleteDialog: false,
		sources: [],
		pointItems: null,
		validationFailures: null,
	};

	public async componentDidMount() {
		let userPoints: UserPoints | null = null;

		try {
			userPoints = await PointsModel.getFull(this.props.user.id).then(response => response.data);
		} catch (error) {
			// The Points API can return a response with a 404 status code if a user does not exist in the Points API.
			// In those cases, just silently ignore the error.
			if (error instanceof ApiError && !error.isNotFound())
				toaster.showUnhandledErrorMessage();
		}

		let sources: PointSourceItem[] = [];

		try {
			sources = await PointSourceModel.list(this.context!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();
		}

		this.setState({
			pointItems: userPoints?.points ?? [],
			sources: sources.sort((a, b) => a.name.localeCompare(b.name)),
			loading: false,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<div className={Classes.PAGE_WRAPPER}>
				<div className="settings-title-container">
					<H2>Points</H2>

					<Button
						text="Delete Selected"
						icon="delete"
						intent="danger"
						onClick={this.onBulkDeleteButtonClick}
						disabled={this.state.selectedItems.length === 0}
					/>

					<Button
						text="Add Points"
						icon="plus"
						intent="primary"
						onClick={this.onAddPointsClick}
					/>
				</div>

				<PointsTable
					onAddPointsClick={this.onAddPointsClick}
					onSelectAll={this.onSelectAll}
					allSelected={this.isAllChecked()}
				>
					{this.state.pointItems?.map(item => (
						<PointsTableRow
							key={item.id.$oid}
							item={item}
							onDelete={this.onBeginDeleteButtonClick}
							isChecked={this.isChecked(item)}
							onSelect={this.onSelect}
						/>
					))}
				</PointsTable>

				<DeleteDialog
					isOpen={this.state.showDeleteDialog}
					subject={this.state.deleteSubject}
					onConfirm={this.onDeleteConfirm}
					onCancel={this.onDeleteCancel}
					multiple={this.state.selectedItems.length > 1}
				/>

				{this.state.showAddPointsDialog && (
					<AddPointsDialog
						sources={this.state.sources}
						processing={this.state.processing}
						onClose={this.onAddPointsDialogClose}
						onSubmit={this.onAddPointsDialogSubmit}
					/>
				)}
			</div>
		);
	}

	private onAddPointsClick = () => this.setState({
		showAddPointsDialog: true,
	});

	private onAddPointsDialogClose = () => this.setState({
		showAddPointsDialog: false,
	});

	private onBulkDeleteButtonClick = () => this.setState({
		deleteSubject: 'Delete',
		showDeleteDialog: true,
		deleteTargets: this.state.selectedItems,
	});

	private onBeginDeleteButtonClick = (items: PointItem[]) => {
		this.setState({
			deleteSubject: items[0].source,
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
			await PointsModel.delete(this.props.user.id, item.id);

			return item;
		}));

		let failureCount = 0;
		const deletedItems: PointItem[] = [];

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
				pointItems: state.pointItems!.filter(item => !deletedItems.includes(item)),
				selectedItems: [],
				deleteTargets: [],
				deleteSubject: '',
				showDeleteDialog: false,
				processing: false,
			}
		));
	};

	private onAddPointsDialogSubmit = async (dialogPointItems: DialogPointItem[]) => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		const results = await allSettled(dialogPointItems.map(item => {
			return PointsModel.create(this.props.user.id, {
				timestamp: new Date(),
				point_value: item.pointValue,
				source: item.sourceName,
				description: item.description,
			}).then(r => r.data);
		}));

		let failureCount = 0;
		let newItems: PointItem[] = [];

		for (const result of results) {
			if (isRejectedResult(result)) {
				++failureCount;

				continue;
			}

			newItems.push(result.value);
		}

		this.setState(state => (
			{
				pointItems: [...state.pointItems!, ...newItems],
			}
		));

		if (failureCount === 0)
			toaster.success('Points Added');
		else if (failureCount !== results.length)
			toaster.warning('Some points couldn\'t be added');
		else
			toaster.error('Failed to add points.');

		this.setState({
			processing: false,
			showAddPointsDialog: false,
		});
	};

	private isChecked = (item: PointItem) => this.state.selectedItems.includes(item);

	private isAllChecked = () => this.state.selectedItems.length === this.state.pointItems!.length;

	private onSelect = (item: PointItem) => {
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
				selectedItems: [...this.state.pointItems!],
			});
		}
	};
}
