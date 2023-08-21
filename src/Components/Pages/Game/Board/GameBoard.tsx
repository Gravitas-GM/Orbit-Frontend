import {Spinner} from '@blueprintjs/core';
import {CSSProperties} from 'react';
import * as React from 'react';
import {Board} from '../../../../Api/Game-Catalog/Models/Boards';
import {BoardRegion, Stage} from '../../../../Api/Game-Catalog/Models/Stages';
import {GameState, PlayerState} from '../../../../Api/Game-State/Models/Games';
import {useTitle} from '../../../PageHeader';
import {GameStage} from './GameStage';

interface IProps {
	board: Board;
	gameState: GameState;
}

function getPlayersAtStage(stage: Stage, players: PlayerState[]) {
	return players.filter(item => item.current_stage_id === stage.id);
}

export type ScaledOffsets = Pick<CSSProperties, 'left' | 'top' | 'width' | 'height'>;

export class Scale {
	public constructor(
		protected scaleX: number,
		protected scaleY: number,
		protected width: number,
		protected height: number,
	) {
	}

	public apply(region: BoardRegion): ScaledOffsets {
		return {
			left: `${region.x * this.scaleX / this.width * 100}%`,
			top: `${region.y * this.scaleY / this.height * 100}%`,
			width: `${region.width * this.scaleX / this.width * 100}%`,
			height: `${region.height * this.scaleY / this.height * 100}%`,
		};
	}
}

export const GameBoard: React.FC<IProps> = ({
	board,
	gameState,
}) => {
	useTitle('Happy Orbit - Game Board');

	const [scale, setScale] = React.useState<Scale | null>(null);
	const backgroundImageRef = React.useCallback((image: HTMLImageElement) => {
		setScale(new Scale(
			image.width / image.naturalWidth,
			image.height / image.naturalHeight,
			image.width,
			image.height,
		));
	}, []);

	return (
		<div id="game-board" style={{ position: 'relative', height: 'fit-content' }}>
			<img ref={backgroundImageRef} src={board.imageUrl} alt="Game Board Background" style={{width: '100%'}} />

			{scale && board.stages.map(stage => (
					<GameStage
						scale={scale}
						stage={stage}
						players={getPlayersAtStage(stage, gameState.players)} key={stage.id}
					/>
				),
			)}
		</div>
	);
};

GameBoard.displayName = 'GameBoard';