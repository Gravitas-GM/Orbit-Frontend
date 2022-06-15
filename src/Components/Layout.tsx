import {Intent, Spinner} from '@blueprintjs/core';
import * as React from 'react';
import {Route, Switch} from 'react-router';
import {Home} from './Home';
import {NavHeader} from './NavHeader';
import {PageNotFound} from './PageNotFound';
import {SourcesList} from './Pages/Sources';
import {UsersList} from './Pages/Users';

interface IProps {
	loading: boolean;
}

export const Layout: React.FC<IProps> = props => (
	props.loading ? (
		<div style={{width: '100%', height: '100vh'}}>
			<Spinner intent={Intent.PRIMARY} />
		</div>
	) : (
		<div style={{flex: 12}}>
			<NavHeader loading={props.loading} />

			<div className="main-frame">
				<Switch>
					<Route path="/" component={Home} exact={true} />

					<Route path="/users" component={UsersList} exact={true} />

					<Route path="/sources" component={SourcesList} exact={true} />

					<Route component={PageNotFound} />
				</Switch>
			</div>
		</div>
	)
);

Layout.displayName = 'Layout';
