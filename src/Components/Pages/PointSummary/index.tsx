import {AnchorButton, H2, HTMLTable} from '@blueprintjs/core';
import * as React from 'react';
import {tokenStorage} from '../../../Api';
import {PointsModel, UserPointsSummary} from '../../../Api/Point-Tracking/Models/Points';
import {PointSourceItem, PointSourceModel} from '../../../Api/Point-Tracking/Models/Sources';
import {UserContext} from '../../../Session';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {classNames} from '../../Utility/dom';
import {formatNumber, ucwords} from '../../Utility/string';

interface IState {
	sources: PointSourceItem[];
	userPoints: UserPointsSummary[];
	loading: boolean;
}

export class PointSummary extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		sources: [],
		userPoints: [],
		loading: true,
	};

	public async componentDidMount() {
		let userPoints: UserPointsSummary[] = [];
		let sources: PointSourceItem[] = [];

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

		this.setState({
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
						</tr>
					</thead>

					<tbody>
						{this.state.userPoints.map(item => (
							<tr key={`point-summary-${item.id}`}>
								<td>{ucwords(item.user_name)}</td>

								{this.state.sources.map(source => this.renderSummaryCell(item, source))}

								<td>{formatNumber(item.total_points)}</td>
							</tr>
						))}
					</tbody>
				</HTMLTable>
			</>
		);
	}

	private renderSummaryCell = (summary: UserPointsSummary, source: PointSourceItem) => {
		let output = 0;

		for (const points of summary.points) {
			if (points.source.toLowerCase() === source.name.toLowerCase())
				output = points.points;
		}

		return (
			<td key={`points-${summary.id}-${source.id.$oid}`}>{formatNumber(output)}</td>
		);
	}
}
