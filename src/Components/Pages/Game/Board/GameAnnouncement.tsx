import {H1, H3} from '@blueprintjs/core';
import * as React from 'react';
import {classNames} from '../../../../utility/dom';
import {ucwords} from '../../../../utility/string';
import './GameAnnouncement.scss';
import {getPlayerStage, PlayerAnnouncement} from '../index';

interface IProps {
	player: PlayerAnnouncement | null;
}

export const GameAnnouncement: React.FC<IProps> = ({player}) => {
	if (!player)
		return null;

	return (
		<div
			className={classNames('game-announcement-container', player && 'player-movement-toast')}
			key={player.player.hub_id}
		>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto'}}>
				<H1>{ucwords(player.player.user_name)}</H1>

				<H3>has moved to</H3>

				<H1>{ucwords(getPlayerStage(player).name)}</H1>
			</div>
		</div>
	);
};

GameAnnouncement.displayName = 'GameAnnouncement';
