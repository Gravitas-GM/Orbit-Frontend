import {Icon, IconSize} from '@blueprintjs/core';
import {PlayerState} from '../../../Api/Game-State/Models/Games';
import './TopRankedUsers.scss';

interface IProps {
	topUsers: PlayerState[];
}

export const TopRankedUsers: React.FC<IProps> = ({topUsers}) => {
	return (
		<ul className="gm-top-ranked-card">
			{topUsers.map(user => (
				<li>
					<Icon icon="user" size={IconSize.LARGE} />
					<span>
						{user.user_name} ({user.current_points} points)
					</span>
				</li>
			))}
		</ul>
	);
};
