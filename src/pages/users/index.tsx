import * as React from 'react';
import {Route, Routes} from 'react-router-dom';
import {Permission} from '../../api/permissions';
import {usePermissions} from '../../contexts/SessionContext';
import {UserEditor} from './Editor';
import {UsersList} from './List';

export function UserRoutes(): React.ReactElement | null {
	const isPermissionGranted = usePermissions();

	if (!isPermissionGranted(Permission.Admin))
		return null;

	return (
		<Routes>
			<Route index={true} element={<UsersList />} />
			<Route path=":user/*" element={<UserEditor />} />
		</Routes>
	);
}
