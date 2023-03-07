import {H1, H3} from '@blueprintjs/core';
import * as React from 'react';
import {UpdateResultType} from '../../../../Api/Game-State/Models/Games';
import {classNames} from '../../../Utility/dom';
import {ucwords} from '../../../Utility/string';
import './GameAnnouncement.scss';
import {PlayerAnnouncement} from '../index';

function getPlayerStageName(player?: PlayerAnnouncement | null) {
	if (!player)
		return 'Stage Name';

	if (player.type === UpdateResultType.MOVED)
		return ucwords(player.new_stage.stage.name);

	else if (player.type === UpdateResultType.CREATED)
		return ucwords(player.initial_stage.name);
}

interface IProps {
	player: PlayerAnnouncement | null;
}

export const GameAnnouncement: React.FC<IProps> = ({ player }) => {
	return (
		<div
			className={classNames('game-announcement-container', player && 'player-movement-toast')}
			key={player?.player.hub_id}
		>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto'}}>
				<H1>{ucwords(player?.player.user_name ?? 'Player Name')}</H1>

				<H3>has moved to</H3>

				<H1>{getPlayerStageName(player)}</H1>
			</div>
		</div>
	);
};

GameAnnouncement.displayName = 'GameAnnouncement';
