import { Button, Intent } from '@blueprintjs/core';
import { useCallback, useState } from 'react';
import { GameState, GameStartPayload } from '../../../../../Api/Game-State/Models/Games';
import { GameCard } from '../GameCard/GameCard';
import { UpdatePreviewDialog } from './UpdatePreviewDialog/';
import { Board } from '../../../../../Api/Game-Catalog/Models/Boards';

/*

Uncomment after feature merge

// new game and next board
import { ConfirmNextBoardDialog } from './ConfirmNextBoardDialog';
import { NewGameDialog } from './NewGameDialog';

*/


interface IProps {
	gameState: GameState;
	board: Board;

	// new game and next board
	goToNextBoard: () => Promise<void>;
	startNewGame: (gameId: GameStartPayload) => Promise<void>;
}

export const AdminControlsCard: React.FC<IProps> = ({ gameState, board, goToNextBoard, startNewGame }) => {

	//  do we really need this?
	const [processing, setIsProcessing] = useState({ preview: false, nextBoard: false, newGame: false });

	const [showUpdatePreviewDialog, setShowUpdatePreviewDialog] = useState(false);


	const onPreviewClick = useCallback(async () => {
		setIsProcessing({
			newGame: false,
			nextBoard: false,
			preview: true
		});

		setShowUpdatePreviewDialog(true);
	}, []);

	const closePreviewDialog = useCallback(async () => {
		setShowUpdatePreviewDialog(false);

		setIsProcessing({
			newGame: false,
			nextBoard: false,
			preview: false
		});
	}, []);

	/*

	Uncomment after feature merge

	// next board
	const [showConfirmNextBoardDialog, setShowConfirmNextBoardDialog] = useState(false);

	const closeNextBoardDialog = useCallback(() => setShowConfirmNextBoardDialog(false), []);

	const confirmNextBoard = useCallback(() => {
		setShowConfirmNextBoardDialog(true);
	}, []);

	const onConfirmNextBoard = useCallback(async () => {
		setShowConfirmNextBoardDialog(false);

		setIsProcessing({ preview: false, newGame: false, nextBoard: true });

		try {
			await goToNextBoard();
		} catch (_) {
			setIsProcessing({ preview: false, newGame: false,  nextBoard: false });

			return;
		}

		setIsProcessing({ preview: false, newGame: false, nextBoard: false });
	}, []);

	// new game

	const [showNewGameDialog, setShowNewGameDialog] = useState(false);

	const closeNewGameDialog = useCallback(() => setShowNewGameDialog(false), []);

	const onNewGameClick = useCallback(() => {
		setShowNewGameDialog(true);
	}, []);

	*/


	return (
		<>
			<GameCard title="Admin Controls" icon="control">
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
					<Button
						title="Preview"
						intent={Intent.PRIMARY}
						onClick={onPreviewClick}
						loading={processing.preview}
					>
						Preview
					</Button>

					{/*

					Uncomment after feature merge

					<Button
						title="Preview"
						intent={Intent.PRIMARY}
						onClick={confirmNextBoard}
						loading={processing.nextBoard}
					>
						Next Board
					</Button>

					<Button
						title="New Game"
						intent={Intent.PRIMARY}
						onClick={onNewGameClick}
						loading={processing.newGame}
					>
						New Game
					</Button>

					*/}
				</div>
			</GameCard>

			{showUpdatePreviewDialog && (
				<UpdatePreviewDialog
					gameState={gameState}
					board={board}
					onClose={closePreviewDialog}
				/>
			)}

			{/*

			Uncomment after feature merge

			{showConfirmNextBoardDialog && (
				<ConfirmNextBoardDialog
					onClose={closeNextBoardDialog}
					moveToNextBoard={onConfirmNextBoard}
				/>
			)}

			{showNewGameDialog &&
				<NewGameDialog
					onClose={closeNewGameDialog}
					startNewGame={startNewGame}
				/>
			}

			*/}

		</>
	);
};