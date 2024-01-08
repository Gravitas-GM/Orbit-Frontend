import * as React from 'react';
import {Classes} from '../../classes';
import {PageHeader} from '../PageHeader';
import {classNames} from '../Utility/dom';
import {DefaultCards} from './DefaultCards';
import {GameCards} from './GameCards';
import {QuizCards} from './QuizCards';
import {AdminCards} from './AdminCards';
import './Home.scss';

export const Home: React.FC = () => {
	return (
		<div className={classNames(Classes.PAGE_WRAPPER, 'home-page-container')}>
			<PageHeader title="Home" />

			<DefaultCards />

			<GameCards />

			<QuizCards />


			<AdminCards />
		</div>
	);
}

Home.displayName = 'Home';
