import * as React from 'react';
import {Board} from '../../../../Api/Game-Catalog/Models/Boards';
import {Stage} from '../../../../Api/Game-Catalog/Models/Stages';
import {GameState, PlayerState} from '../../../../Api/Game-State/Models/Games';
import {GameStage} from './GameStage';
import './GameBoard.scss';

interface IProps {
	board: Board;
	gameState: GameState;
}

function getPlayersAtStage(stage: Stage, players: PlayerState[]) {
	return players.filter(item => item.current_stage_id === stage.id);
}

export const GameBoard: React.FC<IProps> = ({ board, gameState }) => {
	return (
		<div id="game-board" className="game-board-container" style={{ backgroundImage: `url(${board.imageUrl})`}}>
			<div className="game-stage-container" style={{ gridTemplateColumns: `repeat(${board.stages.length}, 1fr)` }}>
				{board.stages.map(stage =>
					<GameStage stage={stage} players={getPlayersAtStage(stage, gameState.players)} key={stage.id} />
				)}
			</div>
		</div>
	);
};

GameBoard.displayName = 'GameBoard';
