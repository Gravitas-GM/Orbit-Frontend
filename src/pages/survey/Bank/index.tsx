import {ReactElement} from 'react';
import {Route} from 'react-router-dom';
import {Routes} from '../../../components/Router/Routes';
import {QuestionEditor} from './QuestionEditor';
import {QuestionList} from './QuestionList';
import {SurveyList} from './SurveyList';

export function BankRoutes(): ReactElement {
	return (
		<Routes>
			<Route index={true} element={<SurveyList />} />
			<Route path=":bank" element={<QuestionList />} />
			<Route path=":bank/questions/:question" element={<QuestionEditor />} />
		</Routes>
	);
}
