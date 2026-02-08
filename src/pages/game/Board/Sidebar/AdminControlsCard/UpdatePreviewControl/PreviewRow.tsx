import * as React from 'react';
import {Board} from '../../../../../../api/Game-Catalog/Models/Boards';
import {
	PlayerChanged,
	PlayerCreated,
	PlayerDeleted,
	PlayerMoved,
	PlayerUpdate,
	UpdateResultType,
} from '../../../../../../api/Game-State/Models/Games';
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

function getStageName(board: Board, stageIndex: number): string {
	return board.stages[stageIndex]?.name ?? '—';
}

function CreatedPlayerRow({board, update}: TypedRowProps<PlayerCreated>): React.ReactElement {
	return (
		<tr>
			<td>{ucwords(update.player.user_name)}</td>
			<td>{ucwords(update.type)}</td>
			<td>&mdash;</td>
			<td>&mdash;</td>
			<td>{formatNumber(update.player.current_points)}</td>
			<td>{ucwords(getStageName(board, update.player.current_stage_index))}</td>
		</tr>
	);
}

function ChangedPlayerRow({board, update}: TypedRowProps<PlayerChanged>): React.ReactElement {
	return (
		<tr>
			<td>{ucwords(update.player.user_name)}</td>
			<td>{ucwords(update.type)}</td>
			<td>{formatNumber(update.player.current_points)}</td>
			<td>{ucwords(getStageName(board, update.player.current_stage_index))}</td>
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
			<td>{ucwords(getStageName(board, update.player.current_stage_index))}</td>
			<td>{formatNumber(update.new_point_total)}</td>
			<td>{ucwords(getStageName(board, update.new_stage.index))}</td>
		</tr>
	);
}

function DeletedPlayerRow({board, update}: TypedRowProps<PlayerDeleted>): React.ReactElement {
	const playerName = update.player?.user_name ? ucwords(update.player.user_name) : `User #${update.player_id}`;
	const currentPoints = update.player ? formatNumber(update.player.current_points) : '—';
	const currentStage = update.player
		? ucwords(getStageName(board, update.player.current_stage_index))
		: '—';

	return (
		<tr>
			<td>{playerName}</td>
			<td>{ucwords(update.type)}</td>
			<td>{currentPoints}</td>
			<td>{currentStage}</td>
			<td>&mdash;</td>
			<td>&mdash;</td>
		</tr>
	);
}
