import {Button, Checkbox, HTMLTable, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {PointItem} from '../../../../api/Point-Tracking/Models/Points';
import {NonIdealState} from '../../../../components/NonIdealState';
import {Spacing} from '../../../../Styles/variables';
import {formatDateTime} from '../../../../utility/date';
import {formatNumber, ucwords} from '../../../../utility/string';

interface ITableProps {
	onAddPointsClick: () => void;
	onSelectAll: () => void;
	allSelected: boolean;
	children?: React.ReactNode;
}

export function PointsTable(props: ITableProps): React.ReactElement {
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
					<th style={{width: Spacing.XLarge}}>
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
}

interface IRowProps {
	item: PointItem;
	onDelete: (items: PointItem) => void;
	isChecked: boolean;
	onSelect: (item: PointItem) => void;
	loading?: boolean;
}

export function PointsTableRow({
	item,
	loading,
	isChecked,
	onDelete,
	onSelect,
}: IRowProps): React.ReactElement {
	const onDeleteClick = React.useCallback(() => onDelete(item), [onDelete, item]);
	const onCheckboxClick = React.useCallback(() => onSelect(item), [onSelect, item]);

	return (
		<tr>
			<td><Checkbox checked={isChecked} onClick={onCheckboxClick} /></td>
			<td>{ucwords(item.source)}</td>
			<td>{formatNumber(item.point_value)}</td>
			<td>{formatDateTime(item.timestamp)}</td>
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
}
