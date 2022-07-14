import {AnchorButton, H2, HTMLTable} from '@blueprintjs/core';
import * as React from 'react';
import {tokenStorage} from '../../../Api';
import {GamesModel, PlayerState} from '../../../Api/Game-State/Models/Games';
import {PointsModel, UserPointsSummary} from '../../../Api/Point-Tracking/Models/Points';
import {PointSourceItem, PointSourceModel} from '../../../Api/Point-Tracking/Models/Sources';
import {UserContext} from '../../../Session';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {classNames} from '../../Utility/dom';
import {formatNumber, ucwords} from '../../Utility/string';

interface IState {
	players: PlayerState[];
	sources: PointSourceItem[];
	userPoints: UserPointsSummary[];
	loading: boolean;
}

export class PointSummary extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		players: [],
		sources: [],
		userPoints: [],
		loading: true,
	};

	public async componentDidMount() {
		let userPoints: UserPointsSummary[] = [];
		let sources: PointSourceItem[] = [];
		let players: PlayerState[] = [];

		try {
			userPoints = await PointsModel.getAllSummary(this.context!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();
		}

		try {
			sources = await PointSourceModel.list(this.context!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();
		}

		try {
			players = await GamesModel.gameInfo(this.context!.account.id).then(response => response.data.players);
		} catch (_) {
			toaster.showUnhandledErrorMessage();
		}

		this.setState({
			players,
			userPoints: userPoints.sort((a, b) => b.total_points - a.total_points),
			sources: sources.sort((a, b) => a.name.localeCompare(b.name)),
			loading: false,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<>
				<div className={classNames('settings-title-container')}>
					<H2>Point Summary</H2>

					<AnchorButton
						text="Download"
						icon="download"
						intent="primary"
						href={`https://points.api.happyorbit.com/points/account/${this.context!.account.id}/total.csv?token=${tokenStorage.getToken()?.jwt}`}
						target="_blank"
					/>
				</div>

				<HTMLTable className={classNames('bp4-html-table-striped')}>
					<thead>
						<tr>
							<th>Name</th>

							{this.state.sources.map(item => (
								<th key={item.id.$oid}>{ucwords(item.name)}</th>
							))}

							<th>Total Points</th>

							<th>Stage</th>
						</tr>
					</thead>

					<tbody>
						{this.state.userPoints.map(item => (
							<tr key={`point-summary-${item.id}`}>
								<td>{ucwords(item.user_name)}</td>

								{this.state.sources.map(source => this.renderSummaryCell(item, source))}

								<td>{formatNumber(item.total_points)}</td>

								<td>{this.renderStageCell(item)}</td>
							</tr>
						))}
					</tbody>
				</HTMLTable>
			</>
		);
	}

	private renderSummaryCell = (summary: UserPointsSummary, source: PointSourceItem) => {
		let output = 0;

		let points = summary.points.find(item => item.source.toLowerCase() === source.name.toLowerCase());

		if (points)
			output = points.points;

		return (
			<td key={`points-${summary.id}-${source.id.$oid}`}>{formatNumber(output)}</td>
		);
	}

	private renderStageCell = (summary: UserPointsSummary) => {
		let player = this.state.players.find(item => item.hub_id === summary.id);

		return ucwords(player?.current_stage_name ?? '');
	}
}
