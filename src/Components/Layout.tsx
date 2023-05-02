import {Intent, Spinner} from '@blueprintjs/core';
import * as React from 'react';
import {Route, Switch} from 'react-router';
import {Permission, PermissionContext} from '../Permission';
import {Home} from './Home';
import {NavHeader} from './NavHeader';
import {PageNotFound} from './PageNotFound';
import {GameInfo} from './Pages/Catalog/GameInfo';
import {GameBoardPage} from './Pages/Game';
import {Leaderboard} from './Pages/Leaderboard';
import {SourcesList} from './Pages/Sources';
import {UsersList} from './Pages/Users';
import {UserEditor} from './Pages/Users/UserEditor';
import {CatalogListPage} from './Pages/Catalog';
import {QuestionListPage} from './Pages/Quiz/QuestionList';
import './Layout.scss'
import { DebugControls } from './Pages/Admin/DebugControls';
import { Config } from '../config';

interface IProps {
	loading: boolean;
}

export const Layout: React.FC<IProps> = props => (
	props.loading ? (
		<div className="loading-container">
			<Spinner intent={Intent.PRIMARY} />
		</div>
	) : (
		<div style={{flex: 12, height: '100%'}}>
			<NavHeader loading={props.loading} />

			<div className="main-frame">
				<PermissionContext.Consumer>
					{([isGranted]) => (
						<Switch>
							<Route path="/" component={Home} exact={true} />

							<Route path="/leaderboard" component={Leaderboard} exact={true} />

							<Route path="/game" component={GameBoardPage} />

							<Route path="/catalog" component={CatalogListPage} exact={true} />

							<Route path="/quiz/questions" component={QuestionListPage} exact={true} />

							{isGranted(Permission.ADMIN) && [
								<Route path="/users" key="/users" component={UsersList} exact={true} />,
								<Route path="/users/:user(\d+)" key="/users/:user" component={UserEditor} exact={true} />,
								<Route path="/sources" key="/sources" component={SourcesList} exact={true} />,
								<Route path="/catalog/:game(\d+)" key="/catalog/:game" component={GameInfo} exact={true} />,
							]}

							{isGranted(Permission.ADMIN) && Config.isDev && [
								<Route path="/debug-controls" key="/debug-controls" component={DebugControls} exact={true} />
							]}

							<Route component={PageNotFound} />
						</Switch>
					)}
				</PermissionContext.Consumer>
			</div>
		</div>
	)
);

Layout.displayName = 'Layout';