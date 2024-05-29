import * as React from 'react';
import {Board} from '../../../../../../Api/Game-Catalog/Models/Boards';
import {
	PlayerChanged,
	PlayerCreated,
	PlayerDeleted,
	PlayerMoved,
	PlayerUpdate,
	UpdateResultType,
} from '../../../../../../Api/Game-State/Models/Games';
import {formatNumber, ucwords} from '../../../../../../utility/string';

interface Props {
	board: Board;
	update: PlayerUpdate;
}

export function PreviewRow({board, update}: Props): React.ReactElement {
	switch (update.type) {
		case UpdateResultType.CREATED:
			return <CreatedPlayerRow board={board} update={update} />;

		case UpdateResultType.CHANGED:
			return <ChangedPlayerRow board={board} update={update} />;

		case UpdateResultType.MOVED:
			return <MovedPlayerRow board={board} update={update} />;

		case UpdateResultType.DELETED:
			return <DeletedPlayerRow update={update} board={board} />;
	}
}

interface TypedRowProps<T extends PlayerUpdate> {
	board: Board;
	update: T;
}

function CreatedPlayerRow({board, update}: TypedRowProps<PlayerCreated>): React.ReactElement {
	return (
		<tr>
			<td>{ucwords(update.player.user_name)}</td>
			<td>{ucwords(update.type)}</td>
			<td>&mdash;</td>
			<td>&mdash;</td>
			<td>{formatNumber(update.player.current_points)}</td>
			<td>{ucwords(board.stages[update.player.current_stage_index].name)}</td>
		</tr>
	);
}

function ChangedPlayerRow({board, update}: TypedRowProps<PlayerChanged>): React.ReactElement {
	return (
		<tr>
			<td>{ucwords(update.player.user_name)}</td>
			<td>{ucwords(update.type)}</td>
			<td>{formatNumber(update.player.current_points)}</td>
			<td>{ucwords(board.stages[update.player.current_stage_index].name)}</td>
			<td>{formatNumber(update.new_point_total)}</td>
			<td>&mdash;</td>
		</tr>
	);
}

function MovedPlayerRow({board, update}: TypedRowProps<PlayerMoved>): React.ReactElement {
	return (
		<tr>
			<td>{ucwords(update.player.user_name)}</td>
			<td>{ucwords(update.type)}</td>
			<td>{formatNumber(update.player.current_points)}</td>
			<td>{ucwords(board.stages[update.player.current_stage_index].name)}</td>
			<td>{formatNumber(update.new_point_total)}</td>
			<td>{ucwords(update.new_stage.stage.name)}</td>
		</tr>
	);
}

function DeletedPlayerRow({board, update}: TypedRowProps<PlayerDeleted>): React.ReactElement {
	return (
		<tr>
			<td>{ucwords(update.player.user_name)}</td>
			<td>{ucwords(update.type)}</td>
			<td>{formatNumber(update.player.current_points)}</td>
			<td>{ucwords(board.stages[update.player.current_stage_index].name)}</td>
			<td>&mdash;</td>
			<td>&mdash;</td>
		</tr>
	);
}
