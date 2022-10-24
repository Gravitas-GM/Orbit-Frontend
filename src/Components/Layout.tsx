import {Intent, Spinner} from '@blueprintjs/core';
import * as React from 'react';
import {Route, Switch} from 'react-router';
import {Permission, PermissionContext} from '../Permission';
import {Home} from './Home';
import {NavHeader} from './NavHeader';
import {PageNotFound} from './PageNotFound';
import {PointSummary} from './Pages/PointSummary';
import {SourcesList} from './Pages/Sources';
import {UsersList} from './Pages/Users';
import {UserEditor} from './Pages/Users/UserEditor';

// do not bother right now
import {Game} from './Pages/Game';

interface IProps {
	loading: boolean;
}

export const Layout: React.FC<IProps> = props => (
	props.loading ? (
		<div style={{width: '100%'}}>
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

							<Route path="/point-summary" component={PointSummary} exact={true} />
							<Route path="/game" key="/game" component={Game} exact={true} />

							{isGranted(Permission.ADMIN) && [
								<Route path="/users" key="/users" component={UsersList} exact={true} />,
								<Route path="/users/:user(\d+)" key="/users/:user" component={UserEditor} exact={true} />,
								<Route path="/sources" key="/sources" component={SourcesList} exact={true} />
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
