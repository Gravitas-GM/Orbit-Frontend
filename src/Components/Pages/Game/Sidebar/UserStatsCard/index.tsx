import {Icon} from '@blueprintjs/core';
import {PlayerState} from '../../../../../Api/Game-State/Models/Games';
import {GameCard} from '../GameCard/GameCard';

interface IProps {
	user: PlayerState;
}

export const UserStatsCard: React.FC<IProps> = ({user}) => {
	return (
		<GameCard title="User Stats" icon="user">
			<div style={{display: 'flex', flexDirection: 'column'}}>
				<span style={{marginBottom:'1rem'}}>
					{user.user_name} ({user.current_points} points)
				</span>
				<span>
					<Icon icon="flag" style={{marginRight: '0.5rem'}} /> {user.current_stage_name}
				</span>
			</div>
		</GameCard>
	);
};
