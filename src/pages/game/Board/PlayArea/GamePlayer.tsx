import {Button, H5, H6, Popover} from '@blueprintjs/core';
import * as React from 'react';
import {PlayerState} from '../../../../api/Game-State/Models/Games';
import {Spacing} from '../../../../Styles/variables';
import {formatNumber, renderPlayerInitials, ucwords} from '../../../../utility/string';
import './GamePlayer.scss';

interface Props {
	player: PlayerState;
}

export function GamePlayer({player}: Props): React.ReactElement {
	return (
		<Popover
			content={
				<div style={{padding: Spacing.Medium}}>
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
}
