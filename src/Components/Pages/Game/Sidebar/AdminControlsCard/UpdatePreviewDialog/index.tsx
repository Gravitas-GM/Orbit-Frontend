import { Button, Dialog, HTMLTable, Intent } from '@blueprintjs/core';
import { useCallback, useState, useEffect, useContext } from 'react';
import { Board } from '../../../../../../Api/Game-Catalog/Models/Boards';
import { GamesModel, GameState, PlayerUpdate } from '../../../../../../Api/Game-State/Models/Games';
import { UserContext } from '../../../../../../Session';
import * as toaster from '../../../../../../Toaster';
import { FrameLoadingSpinner } from '../../../../../FrameLoadingSpinner';

interface IProps {
	onClose: () => void;
	gameState: GameState;
	board: Board;
}

export const UpdatePreviewDialog: React.FC<IProps> = ({ gameState, board, onClose }) => {
	const User = useContext(UserContext);

	const [updateData, setUpdateData] = useState<PlayerUpdate[] | null>([{
		new_point_total: 123,
		new_stage_id: 1,
		player_id: 1111
	}]);

	const fetchUpdateData = useCallback(async () => {
		let updateData: PlayerUpdate[];

		try {
			updateData = await GamesModel.updatePreview(User!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			onClose();

			return;
		}

		setUpdateData(updateData);
	}, []);

	useEffect(() => {
		fetchUpdateData();
	}, []);

	if (!updateData) {
		return (
			<Dialog title="Update Preview" icon="control" isOpen={true} onClose={onClose}>
				<div style={{ marginTop: '1rem' }}>
					<FrameLoadingSpinner />
				</div>
			</Dialog>
		);
	} else {
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
							{updateData.map(player => {
								const playerData = gameState.players.find(p => p.hub_id === player.player_id);

								if (!playerData) return;

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
	}
};
