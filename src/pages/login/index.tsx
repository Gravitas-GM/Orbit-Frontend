import * as React from 'react';
import {Route} from 'react-router';
import {Routes} from 'react-router-dom';
import {Login} from './Login';

export function LoginRoutes(): React.ReactElement {
	return (
		<Routes>
			<Route index={true} element={<Login />} />
		</Routes>
	);
}
