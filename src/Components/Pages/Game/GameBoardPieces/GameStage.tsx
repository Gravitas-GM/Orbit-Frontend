import * as React from 'react';
import {Stage} from '../../../../Api/Game-Catalog/Models/Stages';
import {PlayerState} from '../../../../Api/Game-State/Models/Games';
import {GamePlayer} from './GamePlayer';

interface IProps {
	stage: Stage;
	players: PlayerState[];
}

export const GameStage: React.FC<IProps> = ({ stage, players }) => {
	return (
		<>
			{players.map(player =>
				<GamePlayer player={player} />
			)}
		</>
	);
};

GameStage.displayName = 'GameStage';
