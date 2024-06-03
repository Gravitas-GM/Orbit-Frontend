import * as React from 'react';
import {Route, Routes} from 'react-router-dom';
import {GlobalContexts} from './contexts';
import {Layout} from './Layout';
import {Activate} from './pages/auth/Activate';
import {Login} from './pages/auth/Login';
import {PasswordReset} from './pages/auth/PasswordReset';

export function App(): React.ReactElement {
	return (
		<div id="app-root">
			<GlobalContexts>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/activate" element={<Activate />} />
					<Route path="/password-reset" element={<PasswordReset />} />

					<Route path="*" element={<Layout />} />
				</Routes>
			</GlobalContexts>
		</div>
	);
}
