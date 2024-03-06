import * as React from 'react';
import {useContext} from 'react';
import {Route, Switch} from 'react-router';
import {Config} from '../config';
import {Permission, PermissionContext} from '../Permission';
import {FrameLoadingSpinner} from './FrameLoadingSpinner';
import {Home} from './Home';
import './Layout.scss';
import {NavHeader} from './NavHeader';
import {PageNotFound} from './PageNotFound';
import {DebugControls} from './Pages/Admin/DebugControls';
import {CatalogListPage} from './Pages/Catalog';
import {GameInfo} from './Pages/Catalog/GameInfo';
import {GameBoardPage} from './Pages/Game';
import {Leaderboard} from './Pages/Leaderboard';
import {QuizHistoryPage} from './Pages/Quiz/History';
import {QuestionEditorPage} from './Pages/Quiz/QuestionEditor';
import {QuestionListPage} from './Pages/Quiz/QuestionList';
import {Interstitial as QuizInterstitial} from './Pages/Quiz/Quiz/Interstitial';
import {QuizResultsPage} from './Pages/Quiz/Results';
import {QuizSettings} from './Pages/Quiz/Settings';
import {TagListPage} from './Pages/Quiz/Tags';
import {TagEditor} from './Pages/Quiz/Tags/TagEditor';
import {SourcesList} from './Pages/Sources';
import {BankSurveyEditor} from './Pages/Survey/BankSurveyEditor';
import {BankQuestionEditor} from './Pages/Survey/BankSurveyEditor/BankQuestionEditor';
import {BankSurveyList} from './Pages/Survey/BankSurveyList';
import {UserEditor} from './Pages/Users/Editor';
import {UsersList} from './Pages/Users/List';

interface IProps {
	loading: boolean;
}

export const Layout: React.FC<IProps> = ({loading}) => {
	const [isGranted] = useContext(PermissionContext);

	if (loading)
		return <FrameLoadingSpinner />;

	return (
		<div
			style={{
				flex: 12,
				height: '100%',
			}}
		>
			<NavHeader />

			<div className="main-frame">
				<Switch key={0}>
					<Route path="/" component={Home} exact={true} />

					<Route path="/leaderboard" component={Leaderboard} exact={true} />

					<Route path="/game" component={GameBoardPage} />

					<Route path="/catalog" component={CatalogListPage} exact={true} />

					<Route path="/quiz" component={QuizInterstitial} exact={true} />
					<Route path="/quiz/history" component={QuizHistoryPage} exact={true} />
					<Route path="/quiz/history/:submission(\d+)" component={QuizResultsPage} exact={true} />

					{/* @formatter:off */}
					{isGranted(Permission.ADMIN) && [
						<Route key="/users" path="/users" component={UsersList} exact={true} />,
						<Route key="/users/:user" path="/users/:user(\d+)" component={UserEditor} />,
						<Route key="/sources" path="/sources" component={SourcesList} exact={true} />,
						<Route key="/catalog" path="/catalog" component={CatalogListPage} exact={true} />,
						<Route key="/catalog/:game" path="/catalog/:game(\d+)" component={GameInfo} exact={true} />,
						<Route key="/quiz/tags" path="/quiz/tags" component={TagListPage} exact={true} />,
						<Route key="/quiz/settings" path="/quiz/settings" component={QuizSettings} exact={true} />,
						<Route key="/quiz/questions" path="/quiz/questions" component={QuestionListPage} exact={true} />,
						<Route key="/quiz/questions/:question" path="/quiz/questions/:question(\d+)" component={QuestionEditorPage} exact={true} />,
						<Route key="/quiz/questions/new" path="/quiz/questions/new" component={QuestionEditorPage} exact={true} />,
						<Route key="/quiz/tags/:tag" path="/quiz/tags/:tag(\d+)" component={TagEditor} exact={true} />,
						<Route key="/quiz/tags/new" path="/quiz/tags/new" component={TagEditor} exact={true} />,
					]}
					{/* @formatter:on */}

					{/* @formatter:off */}
					{Config.isDev && isGranted(Permission.ADMIN) && [
						<Route key="/debug-controls" path="/debug-controls" component={DebugControls} exact={true} />,

						// TODO: move these to site admin permission
						<Route key="/survey-bank" path="/survey-bank" component={BankSurveyList} exact={true} />,
						<Route key="/survey-bank/:survey" path="/survey-bank/:survey(\d+)" component={BankSurveyEditor} exact={true} />,
						<Route key="/survey-bank/new" path="/survey-bank/new" component={BankSurveyEditor} exact={true} />,
						<Route key="/survey-bank/:survey/questions/:question" path="/survey-bank/:survey(\d+)/questions/:question(\d+)" component={BankQuestionEditor} exact={true} />,
						<Route key="/survey-bank/:survey/questions/new" path="/survey-bank/:survey(\d+)/questions/new" component={BankQuestionEditor} exact={true} />,
					]}
					{/* @formatter:on */}

					<Route component={PageNotFound} />
				</Switch>
			</div>
		</div>
	);
};

Layout.displayName = 'Layout';
