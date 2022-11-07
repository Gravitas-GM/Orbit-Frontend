import * as React from 'react';
import {Button, H5, H6, Popover} from '@blueprintjs/core';
import {PlayerState} from '../../../../Api/Game-State/Models/Games';
import {formatNumber, renderPlayerInitials, ucwords} from '../../../Utility/string';
import './GamePlayer.scss';

interface IProps {
	player: PlayerState;
}

export const GamePlayer: React.FC<IProps> = ({ player }) => {
	return (
		<Popover
			content={
				<div style={{padding: 10}}>
					<H5>{ucwords(player.user_name)}</H5>

					<H6 style={{display: 'flex', justifyContent: 'center'}}>
						{formatNumber(player.current_points)} Points
					</H6>
				</div>
			}
		>
			<Button
				className='player-button'
				text={renderPlayerInitials(player)}
			/>
		</Popover>
	);
};

GamePlayer.displayName = 'GamePlayer';
