import {
	PlayerChanged,
	PlayerCreated,
	PlayerDeleted,
	PlayerMoved,
	PlayerUpdate,
	UpdateResultType,
} from '../../../../../../Api/Game-State/Models/Games';
import {Board} from '../../../../../../Api/Game-Catalog/Models/Boards';
import {formatNumber, ucwords} from '../../../../../../utility/string';
import * as React from 'react';

interface IProps {
	board: Board;
	update: PlayerUpdate;
}

export const PreviewRow: React.FC<IProps> = ({board, update}) => {
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
};

interface TypedRowProps<T extends PlayerUpdate> {
	board: Board;
	update: T;
}

const CreatedPlayerRow: React.FC<TypedRowProps<PlayerCreated>> = ({board, update}) => (
	<tr>
		<td>{ucwords(update.player.user_name)}</td>
		<td>{ucwords(update.type)}</td>
		<td>&mdash;</td>
		<td>&mdash;</td>
		<td>{formatNumber(update.player.current_points)}</td>
		<td>{ucwords(board.stages[update.player.current_stage_index].name)}</td>
	</tr>
);

const ChangedPlayerRow: React.FC<TypedRowProps<PlayerChanged>> = ({board, update}) => (
	<tr>
		<td>{ucwords(update.player.user_name)}</td>
		<td>{ucwords(update.type)}</td>
		<td>{formatNumber(update.player.current_points)}</td>
		<td>{ucwords(board.stages[update.player.current_stage_index].name)}</td>
		<td>{formatNumber(update.new_point_total)}</td>
		<td>&mdash;</td>
	</tr>
);

const MovedPlayerRow: React.FC<TypedRowProps<PlayerMoved>> = ({board, update}) => (
	<tr>
		<td>{ucwords(update.player.user_name)}</td>
		<td>{ucwords(update.type)}</td>
		<td>{formatNumber(update.player.current_points)}</td>
		<td>{ucwords(board.stages[update.player.current_stage_index].name)}</td>
		<td>{formatNumber(update.new_point_total)}</td>
		<td>{ucwords(update.new_stage.stage.name)}</td>
	</tr>
);

const DeletedPlayerRow: React.FC<TypedRowProps<PlayerDeleted>> = ({update, board}) => (
	<tr>
		<td>{ucwords(update.player.user_name)}</td>
		<td>{ucwords(update.type)}</td>
		<td>{formatNumber(update.player.current_points)}</td>
		<td>{ucwords(board.stages[update.player.current_stage_index].name)}</td>
		<td>&mdash;</td>
		<td>&mdash;</td>
	</tr>
);
