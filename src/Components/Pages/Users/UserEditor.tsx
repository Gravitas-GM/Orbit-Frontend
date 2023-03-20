import { Button, H2, H6, Icon } from '@blueprintjs/core';
import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { User, UserModel } from '../../../Api/Hub/Models/Users';
import { PointItem, PointsModel, UserPoints } from '../../../Api/Point-Tracking/Models/Points';
import { PointSourceItem, PointSourceModel } from '../../../Api/Point-Tracking/Models/Sources';
import { Permission } from '../../../Permission';
import { UserContext } from '../../../Session';
import * as toaster from '../../../Toaster';
import { DeleteDialog } from '../../DeleteDialog';
import { FrameLoadingSpinner } from '../../FrameLoadingSpinner';
import { allSettled, isRejectedResult } from '../../Utility/promise';
import { AddPointsDialog } from './AddPointsDialog';
import { PointsTable, PointsTableRow } from './UserPointsTable';
import { renderUserName } from '../../Utility/string';
import { UpdatableUserData, UserEditDialog } from './UserEditDialog';
import { ApiError } from '../../../Api/errors/rocket';

export type DialogPointItem = {
	pointValue: number;
	sourceName: string;
	description?: string;
}

interface IRouteProps {
	user: string;
}

interface IState {
	user: User | null;
	loading: boolean;
	pointItems: PointItem[];
	processing: boolean;
	redirect: boolean;
	showAddPointsDialog: boolean;
	showEditDialog: boolean;
	sources: PointSourceItem[];
	deleteTarget: PointItem | null,
}

export class UserEditor extends React.PureComponent<RouteComponentProps<IRouteProps>, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		user: null,
		loading: true,
		pointItems: [],
		processing: false,
		redirect: false,
		showAddPointsDialog: false,
		showEditDialog: false,
		sources: [],
		deleteTarget: null,
	};

	public async componentDidMount() {
		const idParam = this.props.match.params.user;

		let user: User;

		try {
			user = await UserModel.read(idParam).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				redirect: true,
			});

			return;
		}

		let userPoints: UserPoints | null = null;

		try {
			userPoints = await PointsModel.getFull(idParam).then(response => response.data);
		} catch (error) {
			// The Points API can return a response with a 404 status code if a user does not exist in the Points API.
			// In those cases, just silently ignore the error.
			if (error instanceof ApiError && error.isNotFound())
				toaster.showUnhandledErrorMessage();
		}

		let sources: PointSourceItem[] = [];

		try {
			sources = await PointSourceModel.list(this.context!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();
		}

		this.setState({
			user,
			pointItems: userPoints?.points ?? [],
			sources: sources.sort((a, b) => a.name.localeCompare(b.name)),
			loading: false,
		});
	}

	public render() {
		if (this.state.redirect)
			return <Redirect to="/users" />;
		else if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<>
				<div className="settings-title-container">
					<H2>{renderUserName(this.state.user!)}</H2>

					<Button
						text="Edit"
						icon="edit"
						loading={this.state.processing}
						onClick={this.onEditClick}
					/>
				</div>

				<div style={{ display: 'flex' }}>
					<H6 style={{ flex: 1 }}>{this.state.user!.emailAddress}</H6>

					{this.state.user!.permissions.includes(Permission.ADMIN) && (
						<H6 style={{ paddingLeft: 10 }}>
							<Icon icon={'person'} style={{ paddingRight: 5 }} intent="warning" />
							Admin
						</H6>
					)}
				</div>

				<div className="settings-title-container" style={{ paddingTop: 25 }}>
					<H2>Points</H2>

					<Button
						text="Add Points"
						icon="plus"
						intent="primary"
						onClick={this.onAddPointsClick}
					/>
				</div>

				<PointsTable onAddPointsClick={this.onAddPointsClick}>
					{this.state.pointItems.map(item => (
						<PointsTableRow
							key={item.id.$oid}
							item={item}
							onDelete={this.onBeginDeleteButtonClick}
							loading={this.state.processing}
						/>
					))}
				</PointsTable>

				<DeleteDialog
					isOpen={this.state.deleteTarget !== null}
					subject={this.state.deleteTarget?.source}
					onConfirm={this.onDeleteConfirm}
					onCancel={this.onDeleteCancel}
				/>

				{this.state.showEditDialog && (
					<UserEditDialog
						user={this.state.user!}
						onSubmit={this.onEditDialogSubmit}
						onClose={this.onEditDialogClose}
					/>
				)}

				{this.state.showAddPointsDialog && (
					<AddPointsDialog
						sources={this.state.sources}
						processing={this.state.processing}
						onClose={this.onAddPointsDialogClose}
						onSubmit={this.onAddPointsDialogSubmit}
					/>
				)}
			</>
		);
	}

	private onEditClick = () => this.setState({
		showEditDialog: true,
	});

	private onEditDialogClose = () => this.setState({
		showEditDialog: false,
	});

	private onAddPointsClick = () => this.setState({
		showAddPointsDialog: true,
	});

	private onAddPointsDialogClose = () => this.setState({
		showAddPointsDialog: false,
	});

	private onEditDialogSubmit = async (update: UpdatableUserData) => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		// Name is a bit of a misnomer; it isn't a "new" user, but the replacement object
		// after the chnages have been applied by the API.
		let newUser: User;

		try {
			newUser = await UserModel.update(this.state.user!.id, {
				admin: update.permissions.includes(Permission.ADMIN),
			}).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				processing: false,
			});

			return;
		}

		toaster.success('User updated.');

		this.setState({
			user: newUser,
			processing: false,
			showEditDialog: false,
		});
	};

	private onBeginDeleteButtonClick = (item: PointItem) => this.setState({
		deleteTarget: item,
	});

	private onDeleteCancel = () => this.setState({
		deleteTarget: null,
	});

	private onDeleteConfirm = async () => {
		if (this.state.processing)
			return;

		let target = this.state.deleteTarget;

		if (!target)
			return;

		this.setState({
			processing: true,
		});

		try {
			await PointsModel.delete(this.state.user!.id, target.id);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				processing: false,
			});

			return;
		}

		this.setState(state => ({
			pointItems: state.pointItems.filter(item => item !== target),
			deleteTarget: null,
			processing: false,
		}));
	};

	private onAddPointsDialogSubmit = async (dialogPointItems: DialogPointItem[]) => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		const results = await allSettled(dialogPointItems.map(async item => {
			return await PointsModel.create(this.state.user!.id, {
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

		this.setState(state => ({
			pointItems: [...state.pointItems, ...newItems],
		}));

		if (failureCount === 0) // complete success, no failures
			toaster.success('Points Added');
		else if (failureCount !== results.length) // some failures, but fewer than the number of requests we sent
			toaster.warning('Some points couldn\'t be added');
		else // complete failure
			toaster.error('Failed to add points.');

		this.setState({
			processing: false,
			showAddPointsDialog: false,
		});
	};
}
