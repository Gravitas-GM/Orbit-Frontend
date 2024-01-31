import * as React from 'react';
import {Route, Switch} from 'react-router';
import {Permission, PermissionContext} from '../Permission';
import {Role, RoleContext} from '../Role';
import {FrameLoadingSpinner} from './FrameLoadingSpinner';
import {Home} from './Home';
import {NavHeader} from './NavHeader';
import {PageNotFound} from './PageNotFound';
import {GameInfo} from './Pages/Catalog/GameInfo';
import {GameBoardPage} from './Pages/Game';
import {Leaderboard} from './Pages/Leaderboard';
import {TagEditor} from './Pages/Quiz/Tags/TagEditor';
import {SourcesList} from './Pages/Sources';
import {UserEditor} from './Pages/Users/Editor';
import {UsersList} from './Pages/Users/List';
import {CatalogListPage} from './Pages/Catalog';
import {QuestionListPage} from './Pages/Quiz/QuestionList';
import {DebugControls} from './Pages/Admin/DebugControls';
import {Config} from '../config';
import {QuizHistoryPage} from './Pages/Quiz/History';
import {QuizSettings} from './Pages/Quiz/Settings';
import {TagListPage} from './Pages/Quiz/Tags';
import {QuestionEditorPage} from './Pages/Quiz/QuestionEditor';
import {QuizResultsPage} from './Pages/Quiz/Results';
import {QuizPage} from './Pages/Quiz/Quiz';
import {SurveyResults} from './Pages/Survey/Results';
import {SurveySettings} from './Pages/Survey/Settings';
import {SurveyPage} from './Pages/Survey/Survey';
import {NextSurvey} from './Pages/Survey/Editor/NextSurvey';
import {SurveyBank} from './Pages/Survey/Editor/SurveyBank';
import {SurveyHistory} from './Pages/Survey/History';
import './Layout.scss';

interface IProps {
	loading: boolean;
}

export const Layout: React.FC<IProps> = props => {
	const [isGranted] = React.useContext(PermissionContext);
	const [hasRole] = React.useContext(RoleContext);

	return (
		props.loading ? (
			<FrameLoadingSpinner />
		) : (
			<div style={{flex: 12, height: '100%'}}>
				<NavHeader />

				<div className="main-frame">
					<Switch key={0}>
						<Route path="/" component={Home} exact={true} />

						<Route path="/leaderboard" component={Leaderboard} exact={true} />

						<Route path="/game" component={GameBoardPage} />

						<Route path="/catalog" component={CatalogListPage} exact={true} />

						<Route path="/quiz" component={QuizPage} exact={true} />
						<Route path="/quiz/history" component={QuizHistoryPage} exact={true} />

						<Route path="/quiz/history/:submission(\d+)" component={QuizResultsPage} exact={true} />

						<Route path="/survey" key="/survey" component={SurveyPage} exact={true} />
						<Route path="/survey/results" component={SurveyResults} exact={true} />,

						{isGranted(Permission.ADMIN) && [
							<Route path="/users" key="/users" component={UsersList} exact={true} />,
							<Route path="/users/:user(\d+)" key="/users/:user" component={UserEditor} />,
							<Route path="/sources" key="/sources" component={SourcesList} exact={true} />,
							<Route path="/catalog" key="/catalog" component={CatalogListPage} exact={true} />,
							<Route path="/catalog/:game(\d+)" key="/catalog/:game" component={GameInfo} exact={true} />,
							<Route path="/quiz/tags" key="/tags" component={TagListPage} exact={true} />,
							<Route path="/quiz/settings" key="/quiz/settings" component={QuizSettings} exact={true} />,
							<Route path="/quiz/questions" key="/quiz/questions" component={QuestionListPage} exact={true} />,
							<Route path="/quiz/questions/:question(\d+)" key="/quiz/questions/:question" component={QuestionEditorPage} exact={true} />,
							<Route path="/quiz/questions/new" key="/quiz/questions/new" component={QuestionEditorPage} exact={true} />,
							<Route path="/quiz/tags/:tag(\d+)" key="/quiz/tags/:tag" component={TagEditor} exact={true} />,
							<Route path="/survey/next" key="/survey/next" component={NextSurvey} exact={true} />,
							<Route path="/survey/settings" key="/survey/settings" component={SurveySettings} exact={true} />,
							<Route path="/survey/history" key="/survey/history" component={SurveyHistory} exact={true} />,
							<Route path="/survey/results/:survey(\d+)" key="/survey/results/(\d+)" component={SurveyResults} exact={true} />,
						]}

						{hasRole(Role.ADMIN) && [
							<Route path="/survey/bank" key="/survey/bank" component={SurveyBank} exact={true} />,
							<Route path="/survey/bank/:id(\d+)" key="/survey/bank/:id" component={SurveyBank} exact={true} />,
						]}

						{Config.isDev && isGranted(Permission.ADMIN) && [
							<Route path="/debug-controls" key="/debug-controls" component={DebugControls} exact={true} />
						]}

						<Route component={PageNotFound} />
					</Switch>
				</div>
			</div>
	));
}


Layout.displayName = 'Layout';
