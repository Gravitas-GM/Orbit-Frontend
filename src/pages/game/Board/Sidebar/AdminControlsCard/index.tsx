import * as React from 'react';
import {Board} from '../../../../../api/Game-Catalog/Models/Boards';
import {GameStartPayload, PlayerState} from '../../../../../api/Game-State/Models/Games';
import {GameCard} from '../GameCard/GameCard';
import {ConfirmNextBoardControl} from './ConfirmNextBoardControl';
import {NewGameControl} from './NewGameControl';
import {RemoveFromBoardControl} from './RemoveFromBoardControl';
import {UpdatePreviewControl} from './UpdatePreviewControl';
import './index.scss';

interface Props {
	board: Board;
	players: PlayerState[];
	goToNextBoard: () => Promise<void>;
	startNewGame: (gameId: GameStartPayload) => Promise<void>;
	hidePlayerFromBoard: (playerId: number) => Promise<void>;
}

export function AdminControlsCard({board, players, goToNextBoard, startNewGame, hidePlayerFromBoard}: Props): React.ReactElement {
	return (
		<GameCard title="Admin Controls" icon="control">
			<div className="admin-controls-container">
				<UpdatePreviewControl
					board={board}
				/>

				<ConfirmNextBoardControl
					goToNextBoard={goToNextBoard}
				/>

				<NewGameControl
					startNewGame={startNewGame}
				/>

				<RemoveFromBoardControl
					players={players}
					hidePlayerFromBoard={hidePlayerFromBoard}
				/>
			</div>
		</GameCard>
	);
}
