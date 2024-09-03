import {Icon} from '@blueprintjs/core';
import * as React from 'react';
import {PlayerState} from '../../../../../api/Game-State/Models/Games';
import {NonIdealState} from '../../../../../components/NonIdealState';
import {Spacing} from '../../../../../Styles/variables';
import {GameCard} from '../GameCard/GameCard';

interface Props {
	player: PlayerState | null;
}

export function PlayerStatsCard({player}: Props): React.ReactElement {
	if (!player) {
		return (
			<GameCard title="Player Stats" icon="user">
				<NonIdealState title="No player data" icon={null} />
			</GameCard>
		);
	}

	return (
		<GameCard title="Player Stats" icon="user">
			<div className="card-content-wrapper">
				<span style={{marginBottom: Spacing.Large}}>
					{player.user_name} ({player.current_points} points)
				</span>

				<span>
					<Icon icon="flag" style={{marginRight: Spacing.Medium}} /> {player.current_stage_name}
				</span>
			</div>
		</GameCard>
	);
}
