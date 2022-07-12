import {AnchorButton, H2, HTMLTable} from '@blueprintjs/core';
import csv from 'csvtojson/index';
import * as React from 'react';
import {tokenStorage} from '../../../Api';
import {PointsModel} from '../../../Api/Point-Tracking/Models/Points';
import {UserContext} from '../../../Session';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {classNames} from '../../Utility/dom';
import {formatNumber, ucwords} from '../../Utility/string';

interface summaryItem {
	key: string;
	value: string;
}

interface IState {
	summary: summaryItem[];
	loading: boolean;
}

export class PointSummary extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		summary: [],
		loading: true,
	};

	public async componentDidMount() {
		let csvFile = '';

		try {
			csvFile = await PointsModel.getSummaryCSV(this.context!.account.id).then(reponse => reponse.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			return;
		}

		const summary = await csv().fromString(csvFile);

		this.setState({
			summary,
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
						href={`${process.env.POINT_TRACKING_URL}/points/account/${this.context!.account.id}/total.csv?token=${tokenStorage.getToken()?.jwt}`}
						target="_blank"
					/>
				</div>

				<HTMLTable className={classNames('bp4-html-table-striped')}>
					<thead>
						<tr>
							{Object.keys(this.state.summary[0]).map(key => (
								<th key={`header-${key}`}>{ucwords(key)}</th>
							))}
						</tr>
					</thead>

					<tbody>
						{this.state.summary.map((item, index) => (
							<tr key={`row-${index}`}>
								{Object.values(item).map((value, index) => (
									<td key={`cell-${index}`}>{this.renderCell(value)}</td>
								))}
							</tr>
						))}
					</tbody>
				</HTMLTable>
			</>
		);
	}

	private renderCell = (input: string) => {
		const parsedInput = parseInt(input, 10);

		if (isNaN(parsedInput))
			return ucwords(input);

		return formatNumber(parsedInput);
	};
}
