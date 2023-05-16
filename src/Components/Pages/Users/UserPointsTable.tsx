import {Button, HTMLTable, Intent, Checkbox} from '@blueprintjs/core';
import * as React from 'react';
import {PointItem} from '../../../Api/Point-Tracking/Models/Points';
import {Spacing} from '../../../Styles/variables';
import {NonIdealState} from '../../NonIdealState';
import {formatNumber, ucwords} from '../../Utility/string';

interface ITableProps {
	onAddPointsClick: () => void;
	onSelectAll: () => void;
	allSelected: boolean;
	children?: React.ReactNode;
}

export const PointsTable: React.FC<ITableProps> = props => {
	if (React.Children.count(props.children) === 0) {
		return (
			<NonIdealState
				title="This user doesn't have any points assigned"
				description="You can start assigning points using the button below"
				action={(
					<Button
						icon="plus"
						text="Add Points"
						onClick={props.onAddPointsClick}
						outlined={true}
						intent={Intent.PRIMARY}
					/>
				)}
			/>
		);
	}

	return (
		<HTMLTable striped={true}>
			<thead>
				<tr>
					<th style={{width: Spacing.xLarge}}>
						<Checkbox checked={props.allSelected} onClick={props.onSelectAll} />
					</th>

					<th>Source</th>
					<th>Point Value</th>
					<th>Timestamp</th>
					<th>Description</th>
					<th style={{width: 100, textAlign: 'center'}}>Delete</th>
				</tr>
			</thead>

			<tbody>
				{props.children}
			</tbody>
		</HTMLTable>
	);
};

interface IRowProps {
	item: PointItem;
	onDelete: (items: PointItem[]) => void;
	isChecked: boolean;
	onSelect: (item: PointItem) => void;
	loading?: boolean;
}

export const PointsTableRow: React.FC<IRowProps> = ({item, loading, isChecked, onDelete, onSelect}) => {
	const onDeleteClick = React.useCallback(() => onDelete([item]), [onDelete, item]);
	const onCheckboxClick = React.useCallback(() => onSelect(item), [onSelect, item]);

	return (
		<tr>
			<td><Checkbox checked={isChecked} onClick={onCheckboxClick} /></td>
			<td>{ucwords(item.source)}</td>
			<td>{formatNumber(item.point_value)}</td>
			<td>{new Date(item.timestamp).toLocaleString()}</td>
			<td>{item.description ?? <>—</>}</td>
			<td style={{textAlign: 'center'}}>
				<Button
					icon="delete"
					minimal={true}
					intent={Intent.DANGER}
					loading={loading}
					onClick={onDeleteClick}
				/>
			</td>
		</tr>
	);
};
