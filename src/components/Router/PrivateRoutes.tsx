import {ReactElement, ReactNode} from 'react';
import {useLocation} from 'react-router';
import {Navigate} from 'react-router-dom';
import {useToken} from '../../contexts/TokenContext';
import {Routes} from './Routes';

interface Props {
	children: ReactNode,
}

export function PrivateRoutes({children}: Props): ReactElement {
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
