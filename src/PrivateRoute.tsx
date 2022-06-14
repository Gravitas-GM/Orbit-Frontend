import * as React from 'react';
import {Redirect, Route, RouteProps} from 'react-router';
import {isAuthenticated} from './Api';
import {history} from './history';

export const PrivateRoute: React.FC<RouteProps> = ({...routeProps}) => {
		if (isAuthenticated()) {
			return <Route {...routeProps} />;
		}

		return (
			<Redirect
				to={{
					pathname: '/login',
					state: {
						from: history.location.pathname,
					},
				}}
			/>
		);
};

PrivateRoute.displayName = "PrivateRoute";
