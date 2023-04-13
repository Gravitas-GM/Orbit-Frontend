import * as React from 'react';
import {Board} from '../../../../Api/Game-Catalog/Models/Boards';
import {Stage} from '../../../../Api/Game-Catalog/Models/Stages';
import {GameState, PlayerState} from '../../../../Api/Game-State/Models/Games';
import { useTitle } from '../../../PageHeader';
import {GameStage} from './GameStage';

interface IProps {
	board: Board;
	gameState: GameState;
}

function getPlayersAtStage(stage: Stage, players: PlayerState[]) {
	return players.filter(item => item.current_stage_id === stage.id);
}

export const GameBoard: React.FC<IProps> = ({ board, gameState }) => {
	useTitle('Happy Orbit - Game Board')
	return (
		<div id="game-board">
			<img src={board.imageUrl} alt="Game Board Background" style={{ width: '100%' }}/>

			{board.stages.map(stage =>
				<GameStage stage={stage} players={getPlayersAtStage(stage, gameState.players)} key={stage.id} />
			)}
		</div>
	);
};

GameBoard.displayName = 'GameBoard';
