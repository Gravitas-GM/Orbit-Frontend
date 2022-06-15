import {H2, H4, HTMLTable} from '@blueprintjs/core';
import * as React from 'react';
import {PointsModel, UserPoints} from '../../../Api/Point-Tracking/Models/Points';
import {UserContext} from '../../../Session';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {classNames} from '../../Utility/dom';
import {formatNumber, ucwords} from '../../Utility/string';

interface IState {
	userPoints: UserPoints[];
	loading: boolean;
}

export class PointSummary extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		userPoints: [],
		loading: true,
	};

	public async componentDidMount() {
		let userPoints: UserPoints[] = [];

		try {
			userPoints = await PointsModel.getAll(this.context!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();
		}

		this.setState({
			userPoints: userPoints.sort((a, b) => a.user_name.localeCompare(b.user_name)),
			loading: false,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<>
				<H2>Point Summary</H2>

				{this.state.userPoints.map(item => (
					<>
						<H4>{item.user_name}</H4>

						<HTMLTable className={classNames('bp4-html-table-striped')}>
							<thead>
								<tr key={`user-points-${item.user_id}`}>
									<th>Source</th>
									<th>Point Value</th>
									<th>Timestamp</th>
									<th>Description</th>
								</tr>
							</thead>
							<tbody>
								{item.points.map(points => (
									<tr key={`point-item-${points.id}`}>
										<td>{ucwords(points.source)}</td>
										<td>{formatNumber(points.point_value)}</td>
										<td>{points.timestamp.toDateString()}</td>
										<td>{points.description}</td>
									</tr>
								))}
							</tbody>
						</HTMLTable>
					</>
				))}
			</>
		);
	}
}
