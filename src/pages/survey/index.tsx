import {ReactElement} from 'react';
import {Route} from 'react-router-dom';
import {Permission} from '../../api/permissions';
import {Role} from '../../api/roles';
import {Routes} from '../../components/Router/Routes';
import {withPermissionRestriction} from '../../components/Router/withPermissionRestriction';
import {withRoleRestriction} from '../../components/Router/withRoleRestriction';
import {BankRoutes} from './Bank';
import {QuestionEditor as LocalQuestionEditor} from './Local/QuestionEditor';
import {QuestionList as LocalQuestionList} from './Local/QuestionList';
import {Settings} from './Settings';

export function SurveyRoutes(): ReactElement {
	return (
		<Routes>
			{withPermissionRestriction(Permission.Admin, (
				<>
					<Route path="settings" element={<Settings />} />

					<Route path="next" element={<LocalQuestionList />} />
					<Route path="next/questions/:question" element={<LocalQuestionEditor />} />
				</>
			))}

			{withRoleRestriction(Role.Admin, (
				<Route path="bank/*" element={<BankRoutes />} />
			))}
		</Routes>
	);
}
