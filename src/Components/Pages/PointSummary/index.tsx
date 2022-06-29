import {Button, H2, HTMLTable} from '@blueprintjs/core';
import * as React from 'react';
import {PointsModel, UserPointsSummary} from '../../../Api/Point-Tracking/Models/Points';
import {UserContext} from '../../../Session';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {classNames} from '../../Utility/dom';
import {formatNumber, ucwords} from '../../Utility/string';

interface IState {
	userPoints: UserPointsSummary[];
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
		let userPoints: UserPointsSummary[] = [];

		try {
			userPoints = await PointsModel.getAllSummary(this.context!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();
		}

		this.setState({
			userPoints: userPoints.sort((a, b) => a.points - b.points),
			loading: false,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<>
				<div className={classNames('settings-title-container')} style={{paddingTop: 25}}>
					<H2>Point Summary</H2>

					<Button
						text="Download"
						icon="download"
						intent="primary"
						onClick={this.onDownloadClick}
					/>
				</div>

				<HTMLTable className={classNames('bp4-html-table-striped')}>
					<thead>
						<tr>
							<th>Name</th>
							<th>Total Points</th>
						</tr>
					</thead>

					<tbody>
						{this.state.userPoints.map(item => (
							<tr key={`point-summary-${item.user_id}`}>
								<td>{ucwords(item.user_name)}</td>
								<td>{formatNumber(item.points)}</td>
							</tr>
						))}
					</tbody>
				</HTMLTable>
			</>
		);
	}

	private onDownloadClick = () => {
		//TODO: implement download csv /larry
	};
}
