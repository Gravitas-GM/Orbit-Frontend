import * as React from 'react';
import {Stage} from '../../../../Api/Game-Catalog/Models/Stages';
import {PlayerState} from '../../../../Api/Game-State/Models/Games';
import {Scale} from './GameBoard';
import {GamePlayer} from './GamePlayer';
import './GameStage.scss';

interface IProps {
	scale: Scale,
	stage: Stage;
	players: PlayerState[];
}

export const GameStage: React.FC<IProps> = ({stage, players, scale}) => {
	return (
		<div
			key={stage.id}
			className="game-stage-container"
			style={scale.apply(stage.boardRegion)}
		>
			{players.map(player =>
				<GamePlayer player={player} key={player.hub_id} />,
			)}
		</div>
	);
};

GameStage.displayName = 'GameStage';