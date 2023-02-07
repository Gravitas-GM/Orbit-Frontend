import {H1, H3} from '@blueprintjs/core';
import * as React from 'react';
import {Stage} from '../../../../Api/Game-Catalog/Models/Stages';
import {PlayerUpdate, UpdateResultType} from '../../../../Api/Game-State/Models/Games';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {classNames} from '../../../Utility/dom';
import {ucwords} from '../../../Utility/string';
import './GameAnnouncement.scss';

interface IProps {
	player: PlayerUpdate | null;
	stage: Stage | null;
}

export const GameAnnouncement: React.FC<IProps> = ({ player, stage }) => {
	// TODO: this is not very clean... Looks into another solution /Larry
	if (player?.type === UpdateResultType.DELETED)
		return <FrameLoadingSpinner />;

	return (
		<div
			className={classNames('game-announcement-container', player && 'player-movement-toast')}
			key={player?.player.hub_id}
		>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto'}}>
				<H1>{ucwords(player?.player.user_name ?? 'Player Name')}</H1>

				<H3>has moved to</H3>

				<H1>{ucwords(stage?.name ?? 'Stage Name')}</H1>
			</div>
		</div>
	);
};

GameAnnouncement.displayName = 'GameAnnouncement';
