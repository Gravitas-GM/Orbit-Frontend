import {Icon, IconSize} from '@blueprintjs/core';
import {PlayerState} from '../../../../../Api/Game-State/Models/Games';
import {GameCard} from '../GameCard/GameCard';
import './TopRankedUsers.scss';

interface IProps {
	topUsers: PlayerState[];
}

export const TopRankedUsers: React.FC<IProps> = ({topUsers}) => {
	return (
		<GameCard title="Top 3/Highest Points" icon="star">
			<ul className="gm-top-ranked-card">
				{topUsers.map(user => (
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
