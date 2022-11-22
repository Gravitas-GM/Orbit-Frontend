import {Button, Dialog, HTMLTable, Intent} from '@blueprintjs/core';
import {Board} from '../../../../../../Api/Game-Catalog/Models/Boards';
import {GameState, PlayerUpdate} from '../../../../../../Api/Game-State/Models/Games';

interface IProps {
	onClose: () => void;
	game: GameState;
	board: Board;
	update: PlayerUpdate[];
}

export const UpdatePreviewDialog: React.FC<IProps> = ({game, board, update, onClose}) => {
	return (
		<Dialog title="Update Preview" icon="control" isOpen={true} onClose={onClose}>
			<div style={{display: 'flex', flexDirection: 'column', padding: '1rem'}}>
				<HTMLTable striped>
					<thead>
						<th>User</th>
						<th>Current Points</th>
						<th>Current Stage</th>
						<th>New Points</th>
						<th>New Stage</th>
					</thead>

					<tbody>
						{game.players.map(player => {
							const updateData = update.find(user => user.player_id === player.hub_id);
							const nextPoints = updateData?.new_point_total ? updateData.new_point_total : '-';
							const nextStage = board.stages.find(stage => updateData?.new_stage_id === stage.id)?.name || '-';

							return (
								<tr key={player.hub_id}>
									<td>{player.user_name}</td>
									<td>{player.current_points}</td>
									<td>{player.current_stage_name}</td>
									<td>{nextPoints}</td>
									<td>{nextStage}</td>
								</tr>
							);
						})}
					</tbody>
				</HTMLTable>
			</div>

			<Button onClick={onClose} intent={Intent.PRIMARY} style={{margin: '0 1rem'}}>
				Close
			</Button>
		</Dialog>
	);
};
