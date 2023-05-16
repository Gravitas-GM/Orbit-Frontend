import * as React from 'react';
import {Button, H5, H6, Popover} from '@blueprintjs/core';
import {PlayerState} from '../../../../Api/Game-State/Models/Games';
import {formatNumber, renderPlayerInitials, ucwords} from '../../../Utility/string';
import './GamePlayer.scss';
import {Spacing} from '../../../../Styles/variables';

interface IProps {
	player: PlayerState;
}

export const GamePlayer: React.FC<IProps> = ({player}) => {
	return (
		<Popover
			content={
				<div style={{padding: Spacing.medium}}>
					<H5>{ucwords(player.user_name)}</H5>

					<H6 style={{display: 'flex', justifyContent: 'center'}}>
						{formatNumber(player.current_points)} Points
					</H6>
				</div>
			}
		>
			<Button
				className="player-button"
				text={renderPlayerInitials(player)}
			/>
		</Popover>
	);
};

GamePlayer.displayName = 'GamePlayer';
