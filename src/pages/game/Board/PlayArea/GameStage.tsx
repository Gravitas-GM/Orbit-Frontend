import * as React from 'react';
import {Stage} from '../../../../Api/Game-Catalog/Models/Stages';
import {PlayerState} from '../../../../Api/Game-State/Models/Games';
import {GamePlayer} from './GamePlayer';
import './GameStage.scss';
import {Scale} from './index';

interface Props {
	scale: Scale,
	stage: Stage;
	players: PlayerState[];
}

export function GameStage({stage, players, scale}: Props): React.ReactElement {
	return (
		<div
			key={stage.id}
			className="game-stage-container"
			style={scale.apply(stage.boardRegion)}
		>
			{players.map(player => <GamePlayer player={player} key={player.hub_id} />)}
		</div>
	);
}
