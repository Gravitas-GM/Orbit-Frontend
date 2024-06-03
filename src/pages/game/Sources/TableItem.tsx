import {Button, Checkbox} from '@blueprintjs/core';
import {Popover2 as Popover} from '@blueprintjs/popover2';
import * as React from 'react';
import {PointSourceItem} from '../../../Api/Point-Tracking/Models/Sources';
import {formatNumber, ucwords} from '../../../utility/string';
import {EditCommands} from './EditCommands';

interface Props {
	processing: boolean;
	item: PointSourceItem;
	onDelete: (item: PointSourceItem) => void;
	onEdit: (item: PointSourceItem) => void;
	onAssignPoints: (item: PointSourceItem) => void;
	onSelect: (item: PointSourceItem) => void;
	isChecked: boolean;
}

export function TableItem({item, onDelete, onEdit, onAssignPoints, onSelect, isChecked, processing}: Props) {
	const onDeleteButtonClick = React.useCallback(() => {
		onDelete(item);
	}, [item, onDelete]);

	const onEditButtonClick = React.useCallback(() => {
		onEdit(item);
	}, [item, onDelete]);

	const onAssignPointsClick = React.useCallback(() => {
		onAssignPoints(item);
	}, [item, onAssignPoints]);

	const onSelectClick = React.useCallback(() => {
		onSelect(item);
	}, [item, onSelect]);

	return (
		<tr>
			<td>
				<Checkbox
					onClick={onSelectClick}
					checked={isChecked}
				/>
			</td>

			<td>{ucwords(item.name)}</td>
			<td>{formatNumber(item.point_value)}</td>

			<td style={{textAlign: 'center'}}>
				<Popover
					minimal={true}
					position="top"
					content={
						<EditCommands
							onDelete={onDeleteButtonClick}
							onEdit={onEditButtonClick}
							onAssignPoints={onAssignPointsClick}
						/>
					}
				>
					<Button icon="cog" minimal={true} disabled={processing} />
				</Popover>
			</td>
		</tr>
	);
}
