import { Button, Intent } from '@blueprintjs/core';
import { useCallback, useState } from 'react';
import { GameState } from '../../../../../Api/Game-State/Models/Games';
import { GameCard } from '../GameCard/GameCard';
import { UpdatePreviewDialog } from './UpdatePreviewDialog/';
import { Board } from '../../../../../Api/Game-Catalog/Models/Boards';

interface IProps {
	game: GameState;
	board: Board;
}

export const AdminControlsCard: React.FC<IProps> = ({ game, board }) => {

	const [showUpdatePreviewDialog, setShowUpdatePreviewDialog] = useState(false);

	const onPreviewClick = useCallback(async () => {
		setShowUpdatePreviewDialog(!showUpdatePreviewDialog);
	}, []);

	return (
		<>
			<GameCard title="Admin Controls" icon="control">
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<Button title="Preview" intent={Intent.PRIMARY} onClick={onPreviewClick}>
						Preview
					</Button>
				</div>
			</GameCard>

			{showUpdatePreviewDialog && (
				<UpdatePreviewDialog
					gameState={game}
					board={board}
					onClose={onPreviewClick}
				/>
			)}
		</>
	);
};
