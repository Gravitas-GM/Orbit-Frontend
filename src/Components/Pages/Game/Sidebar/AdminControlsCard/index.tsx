import { Button, Intent } from '@blueprintjs/core';
import { useCallback, useState, useContext } from 'react';
import { GamesModel, GameStartPayload, GameState, PlayerUpdate } from '../../../../../Api/Game-State/Models/Games';
import { GameCard } from '../GameCard/GameCard';
import { UpdatePreviewDialog } from './UpdatePreviewDialog/';
import * as toaster from '../../../../../Toaster';
import { UserContext } from '../../../../../Session';
import { Board } from '../../../../../Api/Game-Catalog/Models/Boards';
import { NewGameDialog } from './NewGameDialog';

interface IProps {
	gameState: GameState;
	board: Board;
	startNewGame: (gameId: GameStartPayload) => Promise<void>;
}

export const AdminControlsCard: React.FC<IProps> = ({ gameState, board, startNewGame }) => {
	const User = useContext(UserContext);

	const [processing, setIsProcessing] = useState(false);
	const [updateData, setUpdateData] = useState<PlayerUpdate[] | null>(null);

	const [showNewGameDialog, setShowNewGameDialog] = useState(false);

	const closeNewGameDialog = useCallback(() => setShowNewGameDialog(false), []);

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

	const onNewGameClick = useCallback(() => {
		setShowNewGameDialog(true);
	 }, []);

	return (
		<>
			<GameCard title="Admin Controls" icon="control">
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<Button title="Preview" intent={Intent.PRIMARY} onClick={onPreviewClick} loading={processing}>
						Preview
					</Button>

					<Button title="New Game" intent={Intent.PRIMARY} onClick={onNewGameClick} loading={processing}>
						New Game
					</Button>
				</div>
			</GameCard>

			{updateData && (
				<UpdatePreviewDialog
					gameState={gameState}
					board={board}
					players={updateData}
					onClose={clearUpdateData}
				/>
			)}

			{showNewGameDialog && <NewGameDialog onClose={closeNewGameDialog} startNewGame={startNewGame} />}
		</>
	);
};
