import {AnchorButton, Button, H2, HTMLTable} from '@blueprintjs/core';
import * as React from 'react';
import {tokenStorage} from '../../../Api';
import { ApiError } from '../../../Api/errors/rocket';
import {GamesModel, PlayerState} from '../../../Api/Game-State/Models/Games';
import {PointsModel, UserPointsSummary} from '../../../Api/Point-Tracking/Models/Points';
import {PointSourceItem, PointSourceModel} from '../../../Api/Point-Tracking/Models/Sources';
import {UserContext} from '../../../Session';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {formatNumber, ucwords} from '../../Utility/string';
import { NonIdealState } from '../../NonIdealState';
import { PageHeader } from '../../PageHeader';

interface IState {
	players: PlayerState[];
	sources: PointSourceItem[];
	userPoints: UserPointsSummary[];
	loading: boolean;
}

export class Leaderboard extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		players: [],
		sources: [],
		userPoints: [],
		loading: false,
	};

	public async componentDidMount() {
		await this.load();
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		if (this.state.userPoints.length === 0)
			return <NoData />

		const downloadUrl = PointsModel.getSummaryCsvUrl(this.context!.account.id, tokenStorage.getToken()!.jwt);

		return (
			<div className="gm-page-wrapper">
				<PageHeader title="Leaderboard">
					<div style={{ display: "flex", justifyContent: "space-between", width: "100%"}}>
						<Button minimal={true} icon="refresh" onClick={this.onRefreshButtonClick} />

						<AnchorButton
							text="Download"
							icon="download"
							intent="primary"
							href={downloadUrl.toString()}
							target="_blank"
						/>
					</div>
				</PageHeader>

				<HTMLTable striped={true}>
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
			</div>
		);
	}

	private onRefreshButtonClick = async () => {
		await this.load();
	};

	private renderSummaryCell = (summary: UserPointsSummary, source: PointSourceItem) => {
		let output = 0;

		let points = summary.points.find(item => item.source.toLowerCase() === source.name.toLowerCase());

		if (points)
			output = points.points;

		return (
			<td key={`points-${summary.id}-${source.id.$oid}`}>{formatNumber(output)}</td>
		);
	};

	private renderStageCell = (summary: UserPointsSummary) => {
		let player = this.state.players.find(item => item.hub_id === summary.id);

		return player?.current_stage_name ? ucwords(player.current_stage_name) : <>—</>;
	};

	private load = async () => {
		if (this.state.loading)
			return;

		this.setState({
			loading: true,
		});

		let hasError = false;
		let userPoints: UserPointsSummary[] = [];
		
		// TODO This could be simplified and parallelized by using Promise.allSettled() and then checking for any
		//		rejected promises. /tyler

		try {
			userPoints = await PointsModel.getAllSummary(this.context!.account.id).then(response => response.data);
		} catch (_) {
			hasError = true;
		}

		let sources: PointSourceItem[] = [];

		try {
			sources = await PointSourceModel.list(this.context!.account.id).then(response => response.data);
		} catch (_) {
			hasError = true;
		}

		let players: PlayerState[] = [];

		try {
			players = await GamesModel.gameInfo(this.context!.account.id).then(response => response.data.players);
		} catch (error) {
			// The GameState API can return a response with a 404 status code if a game does not exist for the
			// account. In those cases, just silently ignore the error.
			if (error instanceof ApiError && error.isNotFound())
				hasError = true;
		}

		if (hasError)
			toaster.showUnhandledErrorMessage();

		this.setState({
			players,
			userPoints: userPoints.sort((a, b) => b.total_points - a.total_points),
			sources: sources.sort((a, b) => a.name.localeCompare(b.name)),
			loading: false,
		});
	};
}

const NoData: React.FC = () => {
	return (
		<div className="gm-page-wrapper">
			<div className="settings-title-container">
				<H2>Leaderboard</H2>

				<NonIdealState title="This game doesn't have any points yet"/>
			</div>
		</div>
	)
};