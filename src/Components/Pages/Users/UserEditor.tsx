import {Button, Classes, Dialog, FormGroup, H2, H6, HTMLTable, Icon, Intent, Switch} from '@blueprintjs/core';
import * as React from 'react';
import {Redirect, RouteComponentProps} from 'react-router';
import {User, UserModel} from '../../../Api/Hub/Models/Users';
import {PointItem, PointsModel, UserPoints} from '../../../Api/Point-Tracking/Models/Points';
import {PointSourceItem, PointSourceModel} from '../../../Api/Point-Tracking/Models/Sources';
import {Permission} from '../../../Permission';
import {UserContext} from '../../../Session';
import * as toaster from '../../../Toaster';
import {DeleteDialog} from '../../DeleteDialog';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {classNames} from '../../Utility/dom';
import {formatNumber, renderUserName, ucwords} from '../../Utility/string';
import {AddPointsDialog} from './AddPointsDialog';

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
	isAdmin: boolean;
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
		isAdmin: false,
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

		let userPoints: UserPoints;

		try {
			userPoints = await PointsModel.getFull(idParam).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				redirect: true,
			});

			return;
		}

		let sources: PointSourceItem[] = [];

		try {
			sources = await PointSourceModel.list(this.context!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();
		}

		this.setState({
			user,
			isAdmin: user.permissions.includes(Permission.ADMIN),
			pointItems: userPoints.points,
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

				<div style={{display: 'flex'}}>
					<H6 style={{flex: 1}}>{this.state.user!.emailAddress}</H6>

					{this.state.user!.permissions.includes(Permission.ADMIN) && (
						<H6 style={{paddingLeft: 10}}>
							<Icon icon={'person'} style={{paddingRight: 5}} intent="warning" />
							Admin
						</H6>
					)}
				</div>

				<div className="settings-title-container" style={{paddingTop: 25}}>
					<H2>Points</H2>

					<Button
						text="Add Points"
						icon="plus"
						intent="primary"
						onClick={this.onAddPointsClick}
					/>
				</div>

				<HTMLTable striped={true}>
					<thead>
						<tr>
							<th>Source</th>
							<th>Point Value</th>
							<th>Timestamp</th>
							<th>Description</th>
							<th style={{width: 100, textAlign: 'center'}}>Delete</th>
						</tr>
					</thead>

					<tbody>
						{this.state.pointItems.map(item => (
							<tr key={`point-item-${item.id.$oid}`}>
								<td>{ucwords(item.source)}</td>
								<td>{formatNumber(item.point_value)}</td>
								<td>{new Date(item.timestamp).toLocaleString()}</td>
								<td>{item.description ?? <>—</>}</td>
								<td style={{textAlign: 'center'}}>
									<Button
										icon="delete"
										minimal={true}
										intent={Intent.DANGER}
										loading={this.state.processing}
										onClick={() => this.onBeginDeleteButtonClick(item)}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</HTMLTable>

				<DeleteDialog
					isOpen={this.state.deleteTarget !== null}
					subject={this.state.deleteTarget?.source}
					onConfirm={this.onDeleteConfirm}
					onCancel={this.onDeleteCancel}
				/>

				{this.state.showEditDialog && (
					<Dialog
						onClose={this.onEditDialogClose}
						isOpen={true}
						title="Edit User Details"
					>
						<div className={Classes.DIALOG_BODY}>
							<form onSubmit={this.onEditDialogSubmit}>
								<FormGroup
									labelFor="isAdmin"
								>
									<div className="settings-switch-container">
										<span>
											Admin
										</span>

										<Switch
											checked={this.state.isAdmin}
											onChange={this.onIsAdminChange}
											large={true}
										/>
									</div>
								</FormGroup>
							</form>
						</div>

						<div className={Classes.DIALOG_FOOTER}>
							<div className={Classes.DIALOG_FOOTER_ACTIONS}>
								<Button
									text="Cancel"
									onClick={this.onEditDialogClose}
									disabled={this.state.processing}
								/>

								<Button
									intent={Intent.PRIMARY}
									text="Submit"
									onClick={this.onEditDialogSubmit}
									loading={this.state.processing}
								/>
							</div>
						</div>
					</Dialog>
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

	private onIsAdminChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		isAdmin: event.currentTarget.checked,
	});

	private onAddPointsClick = () => this.setState({
		showAddPointsDialog: true,
	});

	private onAddPointsDialogClose = () => this.setState({
		showAddPointsDialog: false,
	});

	private onEditDialogSubmit = async () => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		let user: User;

		try {
			user = await UserModel.update(this.state.user!.id, {
				admin: this.state.isAdmin,
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
			user,
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

	private onAddPointsDialogSubmit = async (dialogPointItem: DialogPointItem) => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		let pointItem: PointItem;

		try {
			pointItem = await PointsModel.create(this.state.user!.id, {
				timestamp: new Date(),
				point_value: dialogPointItem.pointValue,
				source: dialogPointItem.sourceName,
				description: dialogPointItem.description,
			}).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				processing: false,
				showAddPointsDialog: false,
			});

			return;
		}

		toaster.success(
			'Points added.',
		);

		this.setState(state => ({
			processing: false,
			showAddPointsDialog: false,
			pointItems: [...state.pointItems, pointItem],
		}));
	};
}
