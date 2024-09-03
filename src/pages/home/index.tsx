import * as React from 'react';
import {Classes} from '../../classes';
import {PageHeader} from '../../components/PageHeader';
import {classNames} from '../../utility/dom';
import {AdminCards, GameCards, PointsCards, QuizCards} from './cards';

export function Home(): React.ReactElement {
	return (
		<div className={classNames(Classes.PAGE_WRAPPER)} style={{display: 'flex', flexDirection: 'column'}}>
			<PageHeader title="Home" />

			<PointsCards />
			<GameCards />
			<QuizCards />
			<AdminCards />
		</div>
	);
}
