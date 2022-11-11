import {useMemo} from 'react';
import {Icon, IconSize} from '@blueprintjs/core';
import {PlayerState} from '../../../../../Api/Game-State/Models/Games';
import {GameCard} from '../GameCard/GameCard';
import './TopRankedPlayersCard.scss';

interface IProps {
	players: PlayerState[];
}

export const TopRankedPlayersCard: React.FC<IProps> = ({players}) => {
	const topPlayers = useMemo(() => {
		return players
			.sort((a, b) => {
				if (a.current_points < b.current_points)
					return 1;

				if (a.current_points > b.current_points)
					return -1;

				return 0;
			})
			.slice(0, 3);
	}, [players]);

	return (
		<GameCard title="Top 3/Highest Points" icon="star">
			<ul className="gm-top-ranked-card">

				{topPlayers.map(user => (
					<li key={user.user_name}>
						<Icon icon="user" size={IconSize.LARGE} />
						<span>
							{user.user_name} ({user.current_points} points)
						</span>
					</li>
				))}

			</ul>
		</GameCard>
	);
};
