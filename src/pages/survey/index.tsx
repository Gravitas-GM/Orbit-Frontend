import {ReactElement} from 'react';
import {Route} from 'react-router-dom';
import {Role} from '../../api/roles';
import {Routes} from '../../components/Router/Routes';
import {withRoleRestriction} from '../../components/Router/withRoleRestriction';
import {Bank} from './Bank';
import {BankQuestionList} from './Bank/BankQuestionList';

export function SurveyRoutes(): ReactElement {
	return (
		<Routes>
			{withRoleRestriction(Role.Admin, (
				<>
					<Route path="bank" element={<Bank />} />
					<Route path="bank/:bank" element={<BankQuestionList />} />
				</>
			))}
		</Routes>
	);
}
