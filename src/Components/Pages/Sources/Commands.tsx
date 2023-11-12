import * as React from 'react';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {Menu} from '@blueprintjs/core';

interface CommandsProps {
	onDelete: () => void;
	onEdit: () => void;
	onAssignPoints: () => void;
}

export const Commands: React.FC<CommandsProps> = ({onAssignPoints, onDelete, onEdit}) => (
	<Menu>
		<MenuItem text="Edit" icon="edit" onClick={onEdit} />

		<MenuItem text="Assign Points" icon="dollar" onClick={onAssignPoints} />

		<MenuItem text="Delete" icon="trash" onClick={onDelete} />
	</Menu>
);
