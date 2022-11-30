import { Button, Intent } from '@blueprintjs/core';
import { useCallback, useState, useContext } from 'react';
import { GamesModel, GameState, PlayerUpdate } from '../../../../../Api/Game-State/Models/Games';
import { GameCard } from '../GameCard/GameCard';
import { UpdatePreviewDialog } from './UpdatePreviewDialog/';
import * as toaster from '../../../../../Toaster';
import { UserContext } from '../../../../../Session';
import { Board } from '../../../../../Api/Game-Catalog/Models/Boards';

interface IProps {
	game: GameState;
	board: Board;
}

export const AdminControlsCard: React.FC<IProps> = ({ game, board }) => {
	const User = useContext(UserContext);

	const [processing, setIsProcessing] = useState(false);
	const [updateData, setUpdateData] = useState<PlayerUpdate[] | null>(null);

	const clearUpdateData = useCallback(() => setUpdateData(null), []);

	const onPreviewClick = useCallback(async () => {
		setIsProcessing(true);

		let updateData: PlayerUpdate[];

		try {
			updateData = await GamesModel.updatePreview(User!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			setIsProcessing(false);

			return;
		}

		setUpdateData(updateData);

		setIsProcessing(false);
	}, []);

	return (
		<>
			<GameCard title="Admin Controls" icon="control">
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<Button title="Preview" intent={Intent.PRIMARY} onClick={onPreviewClick} loading={processing}>
						Preview
					</Button>
				</div>
			</GameCard>

			{updateData && (
				<UpdatePreviewDialog
					gameState={game}
					board={board}
					players={updateData}
					onClose={clearUpdateData}
				/>
			)}
		</>
	);
};
