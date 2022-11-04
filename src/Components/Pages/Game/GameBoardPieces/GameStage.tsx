import * as React from 'react';
import {Stage} from '../../../../Api/Game-Catalog/Models/Stages';
import {PlayerState} from '../../../../Api/Game-State/Models/Games';
import {GamePlayer} from './GamePlayer';

interface IProps {
	stage: Stage;
	players: PlayerState[];
}

export const GameStage: React.FC<IProps> = ({stage, players}) => {
	return (
		<div
			key={`stage-${stage.id}`}
			style={{
				position: 'absolute',
				left: stage.boardRegion.x,
				top: stage.boardRegion.y,
				width: stage.boardRegion.width,
				height: stage.boardRegion.height,
			}}
		>
			{players.map(player =>
				<GamePlayer player={player} />,
			)}
		</div>
	);
};

GameStage.displayName = 'GameStage';
