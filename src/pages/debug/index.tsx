import * as React from 'react';
import {Route} from 'react-router-dom';
import {Permission} from '../../api/permissions';
import {Routes} from '../../components/Router/Routes';
import {Config} from '../../config';
import {usePermissions} from '../../contexts/SessionContext';
import {DebugControls} from './DebugControls';

export function DebugRoutes(): React.ReactElement | null {
	const isPermissionGranted = usePermissions();

	if (!Config.isDev || !isPermissionGranted(Permission.Admin))
		return null;

	return (
		<Routes>
			<Route index={true} element={<DebugControls />} />
		</Routes>
	);
}
