import * as React from 'react';
import {Route, RouteProps, useLocation} from 'react-router';
import {Navigate} from 'react-router-dom';
import {isAuthenticated} from './Api';

export const PrivateRoute: React.FC<RouteProps> = ({...routeProps}) => {
	const location = useLocation();

	if (isAuthenticated())
		return <Route {...routeProps} />;

	return (
		<Navigate
			to="/login"
			state={{
				from: location.pathname,
			}}
		/>
	);
};

PrivateRoute.displayName = 'PrivateRoute';
