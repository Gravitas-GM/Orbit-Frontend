import * as React from 'react';
import {Route} from 'react-router';
import {FrameLoadingSpinner} from './Components/FrameLoadingSpinner';
import {NavHeader} from './Components/NavHeader';
import {PrivateRoutes} from './Components/Router/PrivateRoutes';
import './Layout.scss';
import {useSession} from './contexts/SessionContext';
import {useToken} from './contexts/TokenContext';
import {DebugRoutes} from './pages/debug';
import {GameRoutes} from './pages/game';
import {Home} from './pages/home';
import {QuizRoutes} from './pages/quiz';
import {UserRoutes} from './pages/users';

export const Layout: React.FC = () => {
	const {token} = useToken();
	const session = useSession();

	// Our global loading state is derived from the app's current token and session contexts. We are globally loading
	// only when a valid token is set and the session is still `null` (indicating it hasn't been fully initialized yet).
	// Otherwise, each component that depends on the session would need to take steps to ensure that the session has
	// been fully loaded before rendering. This way, we don't even try to mount our routing until the session has been
	// loaded (or we don't have a session), so there's no chance for a component to accidentally render before the
	// session has been loaded.
	if (token?.isValid() && !session)
		return <FrameLoadingSpinner />;

	return (
		<div
			style={{
				flex: 12,
				height: '100%',
			}}
		>
			<NavHeader />

			<div className="main-frame">
				<PrivateRoutes>
					<Route index={true} element={<Home />} />
					<Route path="/game/*" element={<GameRoutes />} />
					<Route path="/quiz/*" element={<QuizRoutes />} />
					<Route path="/users/*" element={<UserRoutes />} />

					<Route path="/debug/*" element={<DebugRoutes />} />
				</PrivateRoutes>
			</div>
		</div>
	);
};

Layout.displayName = 'Layout';
