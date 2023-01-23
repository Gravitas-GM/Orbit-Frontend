import { Button, Intent } from '@blueprintjs/core';
import { useCallback, useState } from 'react';
import { GameState, GameStartPayload } from '../../../../../Api/Game-State/Models/Games';
import { GameCard } from '../GameCard/GameCard';
import { UpdatePreviewDialog } from './UpdatePreviewDialog/';
import { Board } from '../../../../../Api/Game-Catalog/Models/Boards';

import { ConfirmNextBoardDialog } from './ConfirmNextBoardDialog';
import { NewGameDialog } from './NewGameDialog';

interface IProps {
	board: Board;
	goToNextBoard: () => Promise<void>;
	startNewGame: (gameId: GameStartPayload) => Promise<void>;
}

export const AdminControlsCard: React.FC<IProps> = ({ board, goToNextBoard, startNewGame }) => {
	const [showUpdatePreviewDialog, setShowUpdatePreviewDialog] = useState(false);

	const onPreviewClick = useCallback(async () => {
		setShowUpdatePreviewDialog(true);
	}, []);

	const closePreviewDialog = useCallback(async () => {
		setShowUpdatePreviewDialog(false);
	}, []);

	const [showConfirmNextBoardDialog, setShowConfirmNextBoardDialog] = useState(false);
	const closeNextBoardDialog = useCallback(() => setShowConfirmNextBoardDialog(false), []);

	const confirmNextBoard = useCallback(() => {
		setShowConfirmNextBoardDialog(true);
	}, []);

	const onConfirmNextBoard = useCallback(async () => {
		try {
			await goToNextBoard();

			await new Promise((res, _) => { setTimeout(() => res(console.log('time end')), 2000) } );
		} catch (_) {
			return;
		}

		setShowConfirmNextBoardDialog(false);
	}, []);

	const [showNewGameDialog, setShowNewGameDialog] = useState(false);

	const closeNewGameDialog = useCallback(() => setShowNewGameDialog(false), []);

	const onNewGameClick = useCallback(() => {
		setShowNewGameDialog(true);
	}, []);


	return (
		<>
			<GameCard title="Admin Controls" icon="control">
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
					<Button
						title="Preview"
						intent={Intent.PRIMARY}
						onClick={onPreviewClick}
					>
						Preview
					</Button>

					<Button
						title="Preview"
						intent={Intent.PRIMARY}
						onClick={confirmNextBoard}
					>
						Next Board
					</Button>

					<Button
						title="New Game"
						intent={Intent.PRIMARY}
						onClick={onNewGameClick}
					>
						New Game
					</Button>

				</div>
			</GameCard>

			{showUpdatePreviewDialog && (
				<UpdatePreviewDialog
					board={board}
					onClose={closePreviewDialog}
				/>
			)}


			{showConfirmNextBoardDialog && (
				<ConfirmNextBoardDialog
					onClose={closeNextBoardDialog}
					onConfirm={onConfirmNextBoard}
				/>
			)}

			{showNewGameDialog &&
				<NewGameDialog
					onClose={closeNewGameDialog}
					onConfirm={startNewGame}
				/>
			}
		</>
	);
};