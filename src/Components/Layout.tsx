import * as React from 'react';
import {Route, Switch} from 'react-router';
import {Permission, PermissionContext} from '../Permission';
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
import {UserEditor as OldUserEditor} from './Pages/_Users/UserEditor';
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
import './Layout.scss';

interface IProps {
	loading: boolean;
}

export const Layout: React.FC<IProps> = props => (
	props.loading ? (
		<FrameLoadingSpinner />
	) : (
		<div style={{flex: 12, height: '100%'}}>
			<NavHeader />

			<div className="main-frame">
				<PermissionContext.Consumer>
					{([isGranted]) => (
						<Switch key={0}>
							<Route path="/" component={Home} exact={true} />

							<Route path="/leaderboard" component={Leaderboard} exact={true} />

							<Route path="/game" component={GameBoardPage} />

							<Route path="/catalog" component={CatalogListPage} exact={true} />

							<Route path="/quiz" component={QuizPage} exact={true} />
							<Route path="/quiz/history" component={QuizHistoryPage} exact={true} />

							<Route path="/quiz/history/:submission(\d+)" component={QuizResultsPage} exact={true} />

							{isGranted(Permission.ADMIN) && [
								<Route path="/users" key="/users" component={UsersList} exact={true} />,
								<Route path="/users/:user(\d+)" key="/users/:user" component={UserEditor} />,
								<Route path="/old/users/:user(\d+)" key="/old/users/:user" component={OldUserEditor} exact={true} />,
								<Route path="/sources" key="/sources" component={SourcesList} exact={true} />,
								<Route path="/catalog" key="/catalog" component={CatalogListPage} exact={true} />,
								<Route path="/catalog/:game(\d+)" key="/catalog/:game" component={GameInfo} exact={true} />,
								<Route path="/quiz/tags" key="/tags" component={TagListPage} exact={true} />,
								<Route path="/quiz/settings" key="/quiz/settings" component={QuizSettings} exact={true} />,
								<Route path="/quiz/questions" key="/quiz/questions" component={QuestionListPage} exact={true} />,
								<Route path="/quiz/questions/:question(\d+)" key="/quiz/questions/:question" component={QuestionEditorPage} exact={true} />,
								<Route path="/quiz/questions/new" key="/quiz/questions/new" component={QuestionEditorPage} exact={true} />,
								<Route path="/quiz/tags/:tag(\d+)" key="/quiz/tags/:tag" component={TagEditor} exact={true} />,
								<Route path="/quiz/tags/new" key="/quiz/tags/new" component={TagEditor} exact={true} />,
							]}

							{Config.isDev && isGranted(Permission.ADMIN) && [
								<Route path="/debug-controls" key="/debug-controls" component={DebugControls} exact={true} />
							]}

							<Route component={PageNotFound} />
						</Switch>
					)}
				</PermissionContext.Consumer>
			</div>
		</div>
	)
);

Layout.displayName = 'Layout';
