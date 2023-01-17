import {
	PlayerUpdate,
	UpdateResultType,
	PlayerCreated,
	PlayerChanged,
	PlayerDeleted,
	PlayerMoved,
	PlayerState,
} from '../../../../../../Api/Game-State/Models/Games';

import { Board } from '../../../../../../Api/Game-Catalog/Models/Boards';

interface IProps {
	board: Board;
	update: PlayerUpdate;
	player?: PlayerState;
}

export const PreviewRow: React.FC<IProps> = ({ board, update, player }) => {
	switch (update.type) {
		case UpdateResultType.CREATED:
			return <CreatedPlayerRow board={board} update={update} />;

		case UpdateResultType.CHANGED:
			return <ChangedPlayerRow board={board} update={update} />;

		case UpdateResultType.MOVED:
			return <MovedPlayerRow board={board} update={update} />;

		case UpdateResultType.DELETED:
			return <DeletedPlayerRow player={player} update={update} board={board} />;
	}
};

interface TypedRowProps<T extends PlayerUpdate> {
	board: Board;
	update: T;
	player?: PlayerState;
}

const CreatedPlayerRow: React.FC<TypedRowProps<PlayerCreated>> = ({ board, update }) => (
	<tr key={update.player.hub_id}>
		<td>{update.player.user_name}</td>
		<td style={{ textTransform: 'capitalize' }}>{update.type}</td>
		<td>{update.player.current_points}</td>
		<td>{board.stages[update.player.current_stage_index].name}</td>
		<td>&mdash;</td>
		<td>&mdash;</td>
	</tr>
);

const ChangedPlayerRow: React.FC<TypedRowProps<PlayerChanged>> = ({ board, update }) => (
	<tr key={update.player.hub_id}>
		<td>{update.player.user_name}</td>
		<td style={{ textTransform: 'capitalize' }}>{update.type}</td>
		<td>{update.player.current_points}</td>
		<td>{board.stages[update.player.current_stage_index].name}</td>
		<td>{update.new_point_total}</td>
		<td>&mdash;</td>
	</tr>
);


const MovedPlayerRow: React.FC<TypedRowProps<PlayerMoved>> = ({ board, update }) => (
	<tr key={update.player.hub_id}>
		<td>{update.player.user_name}</td>
		<td style={{ textTransform: 'capitalize' }}>{update.type}</td>
		<td>{update.player.current_points}</td>
		<td>{board.stages[update.player.current_stage_index].name}</td>
		<td>{update.new_point_total}</td>
		<td>{board.stages[update.new_stage_index].name}</td>
	</tr>
);


const DeletedPlayerRow: React.FC<TypedRowProps<PlayerDeleted>> = ({ player, update, board }) => (
	<tr key={update.player_id}>
		<td>{player!.user_name}</td>
		<td style={{ textTransform: 'capitalize' }}>{update.type}</td>
		<td>{player!.current_points}</td>
		<td>{player?.current_stage_name}</td>
		<td>&mdash;</td>
		<td>&mdash;</td>
	</tr>
);
