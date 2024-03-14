import {H4, Card, Icon} from '@blueprintjs/core';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {CardsGroup} from './CardsGroup';

export const GameCards: React.FC = () => {
	return (
		<CardsGroup title="Game">
				<Link to="/game">
					<Card interactive={true}>
						<Icon icon="star" size={35} />
						<div>
							<H4>Game Board</H4>

							<p>Continue playing on your current game board.</p>
						</div>
					</Card>
				</Link>

				<Link to="/leaderboard">
					<Card interactive={true}>
						<Icon icon="properties" size={35} />

						<div>
							<H4>Leaderboard</H4>

							<p>See how users rank against each other.</p>
						</div>
					</Card>
				</Link>
		</CardsGroup>
	);
};
