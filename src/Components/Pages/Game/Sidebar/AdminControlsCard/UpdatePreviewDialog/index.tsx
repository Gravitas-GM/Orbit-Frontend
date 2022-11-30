import { Button, Dialog, HTMLTable, Intent } from '@blueprintjs/core';
import { Board } from '../../../../../../Api/Game-Catalog/Models/Boards';
import { GameState, PlayerUpdate } from '../../../../../../Api/Game-State/Models/Games';

interface IProps {
	onClose: () => void;
	gameState: GameState;
	board: Board;
	players: PlayerUpdate[];
}

export const UpdatePreviewDialog: React.FC<IProps> = ({ gameState, board, players, onClose }) => {
	return (
		<Dialog title="Update Preview" icon="control" isOpen={true} onClose={onClose}>
			<div style={{ display: 'flex', flexDirection: 'column', padding: '1rem' }}>
				<HTMLTable striped>
					<thead>
						<th>User</th>
						<th>Current Points</th>
						<th>Current Stage</th>
						<th>New Points</th>
						<th>New Stage</th>
					</thead>

					<tbody>
						{players.map(player => {
							const playerData = gameState.players.find(p => p.hub_id === player.player_id)

							if (!playerData)
								return;

							const nextStage = board.stages.find(stage => player.new_stage_id === stage.id)?.name || '—';
							const newPoints = player.new_point_total ? player.new_point_total : '—';

							return (
								<tr key={player.player_id}>
									<td>{playerData.user_name}</td>
									<td>{playerData.current_points}</td>
									<td>{playerData.current_stage_name}</td>
									<td>{nextStage}</td>
									<td>{newPoints}</td>
								</tr>
							);
						})}
					</tbody>
				</HTMLTable>
			</div>

			<Button onClick={onClose} intent={Intent.PRIMARY} style={{ margin: '0 1rem' }}>
				Close
			</Button>
		</Dialog>
	);
};
