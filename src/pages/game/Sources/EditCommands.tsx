import {Intent, Menu} from '@blueprintjs/core';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import * as React from 'react';

interface Props {
	onDelete: () => void;
	onEdit: () => void;
	onAssignPoints: () => void;
}

export function EditCommands({onAssignPoints, onDelete, onEdit}: Props) {
	return (
		<Menu>
			<MenuItem text="Edit" icon="edit" onClick={onEdit} />
			<MenuItem text="Assign Points" icon="plus" onClick={onAssignPoints} />
			<MenuItem text="Delete" icon="delete" onClick={onDelete} intent={Intent.DANGER} />
		</Menu>
	);
}
