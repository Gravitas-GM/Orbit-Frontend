import * as React from 'react';
import {Route, Routes} from 'react-router-dom';
import {GlobalContexts} from './contexts';
import {Layout} from './Layout';
import {LoginRoutes} from './pages/login';

export function App(): React.ReactElement {
	return (
		<div id="app-root">
			<GlobalContexts>
				<Routes>
					<Route path="/login/*" element={<LoginRoutes />} />
					<Route path="*" element={<Layout />} />
				</Routes>
			</GlobalContexts>
		</div>
	);
}
