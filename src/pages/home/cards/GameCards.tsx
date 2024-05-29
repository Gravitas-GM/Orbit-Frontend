import * as React from 'react';
import {NavCard, NavCardGroup} from './index';

export function GameCards(): React.ReactElement {
	return (
		<NavCardGroup title="Game">
			<NavCard
				href="/game"
				icon="star"
				title="Game Board"
				body={<p>Continue playing on your current game board.</p>}
			/>

			<NavCard
				href="/leaderboard"
				icon="properties"
				title="Leaderboard"
				body={<p>See how users rank against each other.</p>}
			/>
		</NavCardGroup>
	);
}
