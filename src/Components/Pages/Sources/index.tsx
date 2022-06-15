import {Button, H2, HTMLTable, Icon} from '@blueprintjs/core';
import * as React from 'react';
import {PointSourceItem, PointSourceModel} from '../../../Api/Point-Tracking/Models/Sources';
import {UserContext} from '../../../Session';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {classNames} from '../../Utility/dom';
import {formatNumber, ucwords} from '../../Utility/string';

interface IState {
	sources: PointSourceItem[];
	loading: boolean;
}

export class SourcesList extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		sources: [],
		loading: true,
	};

	public async componentDidMount() {
		let sources: PointSourceItem[] = [];

		try {
			sources = await PointSourceModel.list(this.context!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();
		}

		this.setState({
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
					<H2>Sources</H2>

					{/*TODO: add onClick handler /larry*/}
					<Button
						text="Add"
						icon="plus"
						intent="primary"
					/>
				</div>

				<HTMLTable className={'bp4-html-table-striped'}>
					<thead>
						<tr>
							<th>Name</th>
							<th>Value</th>
							<th>Edit</th>
						</tr>
					</thead>
					<tbody>
						{this.state.sources.map(source => (
							<tr key={`source-${source.id}`}>
								<td>{ucwords(source.name)}</td>
								<td>{formatNumber(source.point_value)}</td>
								<td><Icon icon={'edit'} /></td>
							</tr>
						))}
					</tbody>
				</HTMLTable>
			</>
		);
	}
}
