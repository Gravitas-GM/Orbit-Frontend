import {ReactElement} from 'react';
import {Route} from 'react-router-dom';
import {Role} from '../../api/roles';
import {Routes} from '../../components/Router/Routes';
import {withRoleRestriction} from '../../components/Router/withRoleRestriction';
import {BankRoutes} from './Bank';

export function SurveyRoutes(): ReactElement {
	return (
		<Routes>
			{withRoleRestriction(Role.Admin, (
				<Route path="bank/*" element={<BankRoutes />} />
			))}
		</Routes>
	);
}
