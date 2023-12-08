import * as React from 'react';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {Intent, Menu} from '@blueprintjs/core';

interface IProps {
	onDelete: () => void;
	onEdit: () => void;
	onAssignPoints: () => void;
}

export const EditCommands: React.FC<IProps> = ({onAssignPoints, onDelete, onEdit}) => (
	<Menu>
		<MenuItem text="Edit" icon="edit" onClick={onEdit} />

		<MenuItem text="Assign Points" icon="plus" onClick={onAssignPoints} />

		<MenuItem text="Delete" icon="delete" onClick={onDelete} intent={Intent.DANGER} />
	</Menu>
);
