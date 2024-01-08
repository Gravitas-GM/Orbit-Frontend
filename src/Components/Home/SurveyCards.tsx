import * as React from 'react';
import {Card, Icon, H4} from '@blueprintjs/core';
import {Link} from 'react-router-dom';
import {CardsGroup} from './CardsGroup';

export const SurveyCards: React.FC = () => {
	return (
		<CardsGroup title="Survey">
			<Link to="/survey/current">
				<Card interactive={true}>
					<Icon icon="third-party" size={35} />
					<div>
						<H4>Take the Survey</H4>
						<p>Take the current week survey.</p>
					</div>
				</Card>
			</Link>

			<Link to="/survei/results">
				<Card interactive={true}>
					<Icon icon="grouped-bar-chart" size={35} />
					<div>
						<H4>Survey Results</H4>
						<p>View current survey results.</p>
					</div>
				</Card>
			</Link>
		</CardsGroup>
	);
};
