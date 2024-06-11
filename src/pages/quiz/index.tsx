import * as React from 'react';
import {Route} from 'react-router-dom';
import {Permission} from '../../api/permissions';
import {Routes} from '../../components/Router/Routes';
import {withPermissionRestriction} from '../../components/Router/withPermissionRestriction';
import {QuizHistoryPage} from './History';
import {QuestionEditorPage} from './QuestionEditor';
import {QuestionListPage} from './QuestionList';
import {Interstitial} from './Quiz/Interstitial';
import {QuizResultsPage} from './Results';
import {QuizSettings} from './Settings';
import {TagListPage} from './Tags';
import {TagEditor} from './Tags/TagEditor';

export function QuizRoutes(): React.ReactElement {
	return (
		<Routes>
			<Route index={true} element={<Interstitial />} />
			<Route path="history/:submission" element={<QuizResultsPage />} />

			{withPermissionRestriction(Permission.Admin, (
				<>
					<Route path="questions" element={<QuestionListPage />} />
					<Route path="questions/:question" element={<QuestionEditorPage />} />

					<Route path="history" element={<QuizHistoryPage />} />

					<Route path="tags" element={<TagListPage />} />
					<Route path="tags/:tag" element={<TagEditor />} />

					<Route path="settings" element={<QuizSettings />} />
				</>
			))}
		</Routes>
	);
}
