import {Button, H5, H6, Popover} from '@blueprintjs/core';
import * as React from 'react';
import {PlayerState} from '../../../../Api/Game-State/Models/Games';
import {formatNumber, renderPlayerInitials, ucwords} from '../../../Utility/string';

interface IProps {
	player: PlayerState;
}

export const GamePlayer: React.FC<IProps> = ({ player }) => {
	return (
		<Popover
			content={
				<div style={{padding: 10}}>
					<H5>{ucwords(player.user_name)}</H5>
					<H6>{formatNumber(player.current_points)} Points</H6>
				</div>
			}
		>
			<Button
				text={renderPlayerInitials(player)}
			/>
		</Popover>
	);
};

GamePlayer.displayName = 'GamePlayer';
