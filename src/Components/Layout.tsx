import * as React from 'react';
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
import {QuizPage} from './Pages/Quiz/Quiz';
import {Interstitial as QuizInterstitial} from './Pages/Quiz/Quiz/Interstitial';
import {QuizResultsPage} from './Pages/Quiz/Results';
import {QuizSettings} from './Pages/Quiz/Settings';
import {TagListPage} from './Pages/Quiz/Tags';
import {TagEditor} from './Pages/Quiz/Tags/TagEditor';
import {SourcesList} from './Pages/Sources';
import {UserEditor} from './Pages/Users/Editor';
import {UsersList} from './Pages/Users/List';

interface IProps {
	loading: boolean;
}

export const Layout: React.FC<IProps> = props => (
	props.loading ? (
		<FrameLoadingSpinner />
	) : (
		<div
			style={{
				flex: 12,
				height: '100%',
			}}
		>
			<NavHeader />

			<div className="main-frame">
				<PermissionContext.Consumer>
					{([isGranted]) => (
						<Switch key={0}>
							<Route path="/" component={Home} exact={true} />

							<Route path="/leaderboard" component={Leaderboard} exact={true} />

							<Route path="/game" component={GameBoardPage} />

							<Route path="/catalog" component={CatalogListPage} exact={true} />

							<Route path="/quiz" component={QuizInterstitial} exact={true} />
							<Route path="/quiz/history" component={QuizHistoryPage} exact={true} />
							<Route path="/quiz/history/:submission(\d+)" component={QuizResultsPage} exact={true} />

							{/* @formatter:off */}
							{isGranted(Permission.ADMIN) && (
								<>
									<Route path="/users" component={UsersList} exact={true} />
									<Route path="/users/:user(\d+)" component={UserEditor} />
									<Route path="/sources" component={SourcesList} exact={true} />
									<Route path="/catalog" component={CatalogListPage} exact={true} />
									<Route path="/catalog/:game(\d+)" component={GameInfo} exact={true} />
									<Route path="/quiz/tags" component={TagListPage} exact={true} />
									<Route path="/quiz/settings" component={QuizSettings} exact={true} />
									<Route path="/quiz/questions" component={QuestionListPage} exact={true} />
									<Route path="/quiz/questions/:question(\d+)" component={QuestionEditorPage} exact={true} />
									<Route path="/quiz/questions/new" component={QuestionEditorPage} exact={true} />
									<Route path="/quiz/tags/:tag(\d+)" component={TagEditor} exact={true} />
									<Route path="/quiz/tags/new" component={TagEditor} exact={true} />
								</>
							)}
							{/* @formatter:on */}

							{Config.isDev && isGranted(Permission.ADMIN) && [
								<Route
									path="/debug-controls"
									key="/debug-controls"
									component={DebugControls}
									exact={true}
								/>,
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
