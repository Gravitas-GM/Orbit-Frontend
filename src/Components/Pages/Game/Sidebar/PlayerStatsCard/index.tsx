import {Icon} from '@blueprintjs/core';
import {PlayerState} from '../../../../../Api/Game-State/Models/Games';
import { Spacing } from '../../../../../Styles/variables';
import {NonIdealState} from '../../../../NonIdealState';
import {GameCard} from '../GameCard/GameCard';

interface IProps {
	player: PlayerState | null;
}

export const PlayerStatsCard: React.FC<IProps> = ({player}) => {
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
				<span style={{ marginBottom: Spacing.l }}>
					{player.user_name} ({player.current_points} points)
				</span>

				<span>
					<Icon icon="flag" style={{ marginRight: Spacing.m }} /> {player.current_stage_name}
				</span>
			</div>
		</GameCard>
	);
};
