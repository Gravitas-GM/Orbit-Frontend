import {Icon, IconSize} from '@blueprintjs/core';
import React, {useMemo} from 'react';
import {PlayerState} from '../../../../../api/Game-State/Models/Games';
import {NonIdealState} from '../../../../../components/NonIdealState';
import {GameCard} from '../GameCard/GameCard';
import './TopRankedPlayersCard.scss';

interface Props {
	players: PlayerState[] | null;
}

export function TopRankedPlayersCard({players}: Props): React.ReactElement {
	const topPlayers = useMemo(() => {
		if (!players)
			return [];

		return players.sort((a, b) => b.current_points - a.current_points).slice(0, 3);
	}, [players]);

	if (players === null || players.length === 0) {
		return (
			<GameCard title="Top 3/Highest Points" icon="star">
				<NonIdealState title="No player data" icon={null} />
			</GameCard>
		);
	}

	return (
		<GameCard title="Top 3/Highest Points" icon="star">
			<ul className="gm-top-ranked-card">
				{topPlayers.map(user => (
					<li key={user.hub_id}>
						<Icon icon="user" size={IconSize.LARGE} />

						<span>
							{user.user_name} ({user.current_points} points)
						</span>
					</li>
				))}
			</ul>
		</GameCard>
	);
}
