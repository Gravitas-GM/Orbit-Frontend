import {Button, H2, HTMLTable, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Redirect, RouteComponentProps} from 'react-router';
import {User, UserModel} from '../../../Api/Hub/Models/Users';
import {PointItem, PointsModel, UserPoints} from '../../../Api/Point-Tracking/Models/Points';
import {PointSourceItem, PointSourceModel} from '../../../Api/Point-Tracking/Models/Sources';
import {UserContext} from '../../../Session';
import * as toaster from '../../../Toaster';
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
	loading: boolean;
	pointItems: PointItem[];
	processing: boolean;
	redirect: boolean;
	showAddPointsDialog: boolean;
	sources: PointSourceItem[];
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
		sources: [],
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
				<HTMLTable className={classNames('bp4-html-table-striped')}>
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Admin</th>
						</tr>
					</thead>

					<tbody>
						<tr>
							<td>
								{renderUserName(this.state.user!)}
							</td>
							<td>{this.state.user!.emailAddress}</td>
							<td>{this.state.user!.admin ? 'Yes' : 'No'}</td>
						</tr>
					</tbody>
				</HTMLTable>

				<div className={classNames('settings-title-container')} style={{paddingTop: 25}}>
					<H2>Points</H2>

					<Button
						text="Add Points"
						icon="plus"
						intent="primary"
						onClick={() => this.onAddPointsClick()}
					/>
				</div>

				<HTMLTable className={classNames('bp4-html-table-striped')}>
					<thead>
						<tr>
							<th>Source</th>
							<th>Point Value</th>
							<th>Timestamp</th>
							<th>Description</th>
							<th>Delete</th>
						</tr>
					</thead>

					<tbody>
						{this.state.pointItems.map(item => (
							<tr key={`point-item-${item.id.$oid}`}>
								<td>{ucwords(item.source)}</td>
								<td>{formatNumber(item.point_value)}</td>
								<td>{new Date().toDateString()}</td>
								<td>{item.description}</td>
								<td style={{width: 100}}>
									<Button
										icon="delete"
										minimal={true}
										intent={Intent.DANGER}
										loading={this.state.processing}
										onClick={() => this.onDeleteClick(item)}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</HTMLTable>

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

	private onAddPointsClick = () => this.setState({
		showAddPointsDialog: true,
	});

	private onAddPointsDialogClose = () => this.setState({
		showAddPointsDialog: false,
	});

	private onDeleteClick = async (pointItem: PointItem) => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		try {
			await PointsModel.delete(this.state.user!.id, pointItem.id);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				processing: false,
			});

			return;
		}

		this.setState(state => ({
			pointItems: state.pointItems.filter(item => item !== pointItem),
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
