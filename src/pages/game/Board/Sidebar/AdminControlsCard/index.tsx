import * as React from 'react';
import {Board} from '../../../../../Api/Game-Catalog/Models/Boards';
import {GameStartPayload} from '../../../../../Api/Game-State/Models/Games';
import {GameCard} from '../GameCard/GameCard';
import {ConfirmNextBoardControl} from './ConfirmNextBoardControl';
import {NewGameControl} from './NewGameControl';
import {UpdatePreviewControl} from './UpdatePreviewControl';
import './index.scss';

interface Props {
	board: Board;
	goToNextBoard: () => Promise<void>;
	startNewGame: (gameId: GameStartPayload) => Promise<void>;
}

export function AdminControlsCard({board, goToNextBoard, startNewGame}: Props): React.ReactElement {
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
			</div>
		</GameCard>
	);
}
