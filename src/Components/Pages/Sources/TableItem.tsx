import * as React from 'react';
import {Button} from '@blueprintjs/core';
import {Popover2 as Popover} from '@blueprintjs/popover2';
import {PointSourceItem} from '../../../Api/Point-Tracking/Models/Sources';
import {ucwords, formatNumber} from '../../Utility/string';
import {EditCommands} from './EditCommands';

interface IProps {
	processing: boolean;
	item: PointSourceItem;
	onDelete: (item: PointSourceItem) => void;
	onEdit: (item: PointSourceItem) => void;
	onAssignPoints: (item: PointSourceItem) => void;
}

export const TableItem: React.FC<IProps> = ({item, onDelete, onEdit, onAssignPoints, processing}) => {
	const onDeleteButtonClick = React.useCallback(() => {
		onDelete(item);
	}, [item, onDelete]);

	const onEditButtonClick = React.useCallback(() => {
		onEdit(item);
	}, [item, onDelete]);

	const onAssignPointsClick = React.useCallback(() => {
		onAssignPoints(item);
	}, [item, onAssignPoints]);

	return (
		<tr>
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
};
