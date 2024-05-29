import * as React from 'react';
import {Route} from 'react-router';
import {FrameLoadingSpinner} from './Components/FrameLoadingSpinner';
import {NavHeader} from './Components/NavHeader';
import {PrivateRoutes} from './Components/PrivateRoutes';
import {useGlobalLoading} from './contexts/LoadingContext';
import './Layout.scss';
import {GameRoutes} from './pages/game';
import {Home} from './pages/home';

export const Layout: React.FC = () => {
	const {loading} = useGlobalLoading();

	if (loading)
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
				</PrivateRoutes>
			</div>
		</div>
	);
};

Layout.displayName = 'Layout';
