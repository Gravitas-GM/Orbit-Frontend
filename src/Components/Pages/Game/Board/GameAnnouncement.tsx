import {H1, H3} from '@blueprintjs/core';
import * as React from 'react';
import {PlayerState} from '../../../../Api/Game-State/Models/Games';
import {classNames} from '../../../Utility/dom';
import {ucwords} from '../../../Utility/string';
import './GameAnnouncement.scss';

interface IProps {
	player: PlayerState | null;
}

export const GameAnnouncement: React.FC<IProps> = ({ player }) => {
	return (
		<div
			className={classNames('game-announcement-container', player && 'fade')}
			key={player?.hub_id}
		>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto'}}>
				<H1>{ucwords(player?.user_name ?? 'Player Name')}</H1>

				<H3>has moved to</H3>

				<H1>{ucwords(player?.current_stage_name ?? 'Stage Name')}</H1>
			</div>
		</div>
	);
};

GameAnnouncement.displayName = 'GameAnnouncement';
