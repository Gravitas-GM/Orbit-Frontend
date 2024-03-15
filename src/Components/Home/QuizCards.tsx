import * as React from 'react';
import {Card, Icon, H4} from '@blueprintjs/core';
import {Link} from 'react-router-dom';
import {CardsGroup} from './CardsGroup';

export const QuizCards: React.FC = () => {
	return (
		<CardsGroup title="Quiz">
			<Link to="/quiz">
				<Card interactive={true}>
					<Icon icon="predictive-analysis" size={35} />
					<div>
						<H4>Take A Quiz</H4>
						<p>Complete the current quiz.</p>
					</div>
				</Card>
			</Link>

			<Link to="/quiz/history">
				<Card interactive={true}>
					<Icon icon="history" size={35} />
					<div>
						<H4>Quiz History</H4>
						<p>View past quiz submissions.</p>
					</div>
				</Card>
			</Link>
		</CardsGroup>
	);
};
