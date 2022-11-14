import {Icon} from '@blueprintjs/core';
import {PlayerState} from '../../../../../Api/Game-State/Models/Games';
import {NonIdealState} from '../../../../NonIdealState';
import {GameCard} from '../GameCard/GameCard';

interface IProps {
	player: PlayerState | null;
}

export const PlayerStatsCard: React.FC<IProps> = ({player}) => {
	return (
		<GameCard title="Player Stats" icon="user">
			{!player ? (
				<NonIdealState title="No current player stats" />
			) : (
				<div style={{display: 'flex', flexDirection: 'column'}}>
					<span style={{marginBottom: '1rem'}}>
						{player.user_name} ({player.current_points} points)
					</span>

					<span>
						<Icon icon="flag" style={{marginRight: '0.5rem'}} /> {player.current_stage_name}
					</span>
				</div>
			)}
		</GameCard>
	);
};
