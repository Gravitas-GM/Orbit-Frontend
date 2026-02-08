import {H1, H3} from '@blueprintjs/core';
import * as React from 'react';
import {Board} from '../../../../api/Game-Catalog/Models/Boards';
import {classNames} from '../../../../utility/dom';
import {ucwords} from '../../../../utility/string';
import './GameAnnouncement.scss';
import {getPlayerStageFromBoard, PlayerAnnouncement} from '../index';

interface Props {
	player: PlayerAnnouncement | null;
	board: Board;
}

export function GameAnnouncement({player, board}: Props): React.ReactElement | null {
	if (!player)
		return null;

	const stage = getPlayerStageFromBoard(player, board);

	return (
		<div
			className={classNames('game-announcement-container', player && 'player-movement-toast')}
			key={player.player.hub_id}
		>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto'}}>
				<H1>{ucwords(player.player.user_name)}</H1>

				<H3>has moved to</H3>

				<H1>{ucwords(stage.name)}</H1>
			</div>
		</div>
	);
}
