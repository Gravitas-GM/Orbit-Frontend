import {AnchorButton, Button, HTMLTable} from '@blueprintjs/core';
import * as React from 'react';
import {tokenStorage} from '../../../api';
import {ApiError} from '../../../api/errors/rocket';
import {GamesModel, PlayerState} from '../../../api/Game-State/Models/Games';
import {User} from '../../../api/Hub/Models/Users';
import {PointsModel, UserPointsSummary} from '../../../api/Point-Tracking/Models/Points';
import {PointSourceItem, PointSourceModel} from '../../../api/Point-Tracking/Models/Sources';
import {Classes} from '../../../classes';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {NonIdealState} from '../../../components/NonIdealState';
import {PageHeader} from '../../../components/PageHeader';
import {useAppUser} from '../../../contexts/SessionContext';
import {toaster} from '../../../toaster';
import {formatNumber, ucwords} from '../../../utility/string';
import './index.scss';

export function Leaderboard(): React.ReactElement {
	return <LeaderboardInner user={useAppUser()} />;
}

interface Props {
	user: User,
}

interface State {
	players: PlayerState[];
	sources: PointSourceItem[];
	userPoints: UserPointsSummary[];
	loading: boolean;
}

class LeaderboardInner extends React.PureComponent<Props, State> {
	public state: Readonly<State> = {
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
			return <NoData />;

		const downloadUrl = PointsModel.getSummaryCsvUrl(this.props.user.account.id, tokenStorage.getToken()!.jwt);

		return (
			<div className="leaderboard-container">
				<PageHeader title="Leaderboard">
					<div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
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

							<th>Total Points</th>

							<th>Stage</th>

							{this.state.sources.map(item => (
								<th key={item.id.$oid}>{ucwords(item.name)}</th>
							))}
						</tr>
					</thead>

					<tbody>
						{this.state.userPoints.map(item => (
							<tr key={`point-summary-${item.id}`}>
								<td>{ucwords(item.user_name)}</td>
								<td>{formatNumber(item.total_points)}</td>
								<td>{this.renderStageCell(item)}</td>

								{this.state.sources.map(source => this.renderSummaryCell(item, source))}
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
			userPoints = await PointsModel.getAllSummary(this.props.user.account.id).then(response => response.data);
		} catch (_) {
			hasError = true;
		}

		let sources: PointSourceItem[] = [];

		try {
			sources = await PointSourceModel.list(this.props.user.account.id).then(response => response.data);
		} catch (_) {
			hasError = true;
		}

		let players: PlayerState[] = [];

		try {
			players = await GamesModel.gameInfo(this.props.user.account.id).then(response => response.data.players);
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

function NoData(): React.ReactElement {
	return (
		<div className={Classes.PAGE_WRAPPER}>
			<PageHeader title="Leaderboard" />

			<div>
				<NonIdealState title="This game doesn't have any points yet." />
			</div>
		</div>
	);
}
