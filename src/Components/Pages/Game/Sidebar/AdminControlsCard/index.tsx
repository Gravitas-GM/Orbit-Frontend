import { Button, Intent } from '@blueprintjs/core';
import { useCallback, useState, useContext } from 'react';
import { GamesModel, GameState, PlayerUpdate } from '../../../../../Api/Game-State/Models/Games';
import { GameCard } from '../GameCard/GameCard';
import { UpdatePreviewDialog } from './UpdatePreviewDialog/';
import * as toaster from '../../../../../Toaster';
import { UserContext } from '../../../../../Session';
import { Board } from '../../../../../Api/Game-Catalog/Models/Boards';
import { ConfirmNextBoardDialog } from './ConfrmNextBoardDialog';

interface IProps {
	gameState: GameState;
	board: Board;
	goToNextBoard: () => Promise<void>;
}

export const AdminControlsCard: React.FC<IProps> = ({ gameState, board, goToNextBoard }) => {
	const User = useContext(UserContext);

	const [processing, setIsProcessing] = useState({ preview: false, nextBoard: false });

	const [updateData, setUpdateData] = useState<PlayerUpdate[] | null>(null);

	const [showConfirmNextBoardDialog, setShowConfirmNextBoardDialog] = useState(false);

	const clearUpdateData = useCallback(() => setUpdateData(null), []);

	const closeNextBoardDialog = useCallback(() => setShowConfirmNextBoardDialog(false), []);

	const confirmNextBoard = useCallback(() => {
		setShowConfirmNextBoardDialog(true);
	}, []);

	const onConfirmNextBoard = useCallback(async () => {
		setShowConfirmNextBoardDialog(false);

		setIsProcessing({ preview: false, nextBoard: true });

		try {
			await goToNextBoard();
		} catch (_) {
			setIsProcessing({ preview: false, nextBoard: false });
			return;
		}

		setIsProcessing({ preview: false, nextBoard: false });
	}, []);

	const onPreviewClick = useCallback(async () => {
		setIsProcessing({ preview: true, nextBoard: false });

		let updateData: PlayerUpdate[];

		try {
			updateData = await GamesModel.updatePreview(User!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			setIsProcessing({ preview: false, nextBoard: false });

			return;
		}

		setUpdateData(updateData);

		setIsProcessing({ preview: false, nextBoard: false });
	}, []);

	return (
		<>
			<GameCard title="Admin Controls" icon="control">
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
					<Button title="Preview" intent={Intent.PRIMARY} onClick={onPreviewClick} loading={processing.preview}>
						Preview
					</Button>

					<Button title="Preview" intent={Intent.PRIMARY} onClick={confirmNextBoard} loading={processing.nextBoard}>
						Next Board
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

			{showConfirmNextBoardDialog && (
				<ConfirmNextBoardDialog
					onClose={closeNextBoardDialog}
					moveToNextBoard={onConfirmNextBoard}
				/>
			)}
		</>
	);
};
