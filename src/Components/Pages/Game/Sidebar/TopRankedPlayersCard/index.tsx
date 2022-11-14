import {useMemo} from 'react';
import {Icon, IconSize} from '@blueprintjs/core';
import {PlayerState} from '../../../../../Api/Game-State/Models/Games';
import {GameCard} from '../GameCard/GameCard';
import './TopRankedPlayersCard.scss';
import {NonIdealState} from '../../../../NonIdealState';

interface IProps {
	players: PlayerState[] | null;
}

export const TopRankedPlayersCard: React.FC<IProps> = ({players}) => {
	const topPlayers = useMemo(() => {
		if (players === null)
			return [];

		return players.sort((a, b) => b.current_points - a.current_points).slice(0, 3);
	}, [players]);

	const isInvalidData = useMemo(()=> {
		return  players === null || players.length === 0;
	}, [players])

	return (
		<GameCard title="Top 3/Highest Points" icon="star">
			{isInvalidData ? (
				<NonIdealState title="No player data" />
			) : (
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
			)}
		</GameCard>
	);
};
