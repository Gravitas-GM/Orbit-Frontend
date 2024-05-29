import * as React from 'react';
import {useLocation} from 'react-router';
import {Navigate, Routes} from 'react-router-dom';
import {useToken} from '../contexts/TokenContext';

interface Props {
	children: React.ReactNode,
}

export function PrivateRoutes({children}: Props): React.ReactElement {
	const {pathname} = useLocation();
	const {token} = useToken();

	if (!token?.isValid())
		return <Navigate to="/login" state={{from: pathname}} />;

	return (
		<Routes>
			{children}
		</Routes>
	);
}
