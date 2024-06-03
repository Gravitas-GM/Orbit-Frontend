import * as React from 'react';
import {NavCard, NavCardGroup} from './index';

export function QuizCards(): React.ReactElement {
	return (
		<NavCardGroup title="Quiz">
			<NavCard
				href="/quiz"
				icon="predictive-analysis"
				title="Take A Quiz"
				body={<p>Complete the current quiz.</p>}
			/>

			<NavCard
				href="/quiz/history"
				icon="history"
				title="Quiz History"
				body={<p>View past quiz submissions.</p>}
			/>
		</NavCardGroup>
	);
}
