import {ReactElement} from 'react';
import {Route, Routes} from 'react-router-dom';
import {GlobalContexts} from './contexts';
import {Layout} from './Layout';
import {Activate} from './pages/auth/Activate';
import {Login} from './pages/auth/Login';
import {PasswordReset} from './pages/auth/PasswordReset';
import {NotFound} from './pages/error/NotFound';

export function App(): ReactElement {
	return (
		<div id="app-root">
			<GlobalContexts>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/activate" element={<Activate />} />
					<Route path="/password-reset" element={<PasswordReset />} />

					<Route path="/404" element={<NotFound />} />

					<Route path="*" element={<Layout />} />
				</Routes>
			</GlobalContexts>
		</div>
	);
}
