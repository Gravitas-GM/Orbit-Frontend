import {ReactElement} from 'react';
import {Route} from 'react-router-dom';
import {Permission} from '../../api/permissions';
import {Role} from '../../api/roles';
import {Routes} from '../../components/Router/Routes';
import {withPermissionRestriction} from '../../components/Router/withPermissionRestriction';
import {withRoleRestriction} from '../../components/Router/withRoleRestriction';
import {BankRoutes} from './Bank';
import {QuestionList as LocalQuestionList} from './Local/QuestionList';

export function SurveyRoutes(): ReactElement {
	return (
		<Routes>
			{withPermissionRestriction(Permission.Admin, (
				<Route path="next" element={<LocalQuestionList />} />
			))}

			{withRoleRestriction(Role.Admin, (
				<Route path="bank/*" element={<BankRoutes />} />
			))}
		</Routes>
	);
}
