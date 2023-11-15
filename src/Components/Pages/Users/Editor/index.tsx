import * as React from 'react';
import {Divider, H1, Tab, Tabs} from '@blueprintjs/core';
import {Redirect, Route, RouteComponentProps, Switch} from 'react-router';
import {Link} from 'react-router-dom';
import {User, UserModel} from '../../../../Api/Hub/Models/Users';
import {Classes} from '../../../../classes';
import {toaster} from '../../../../toaster';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {renderUserName} from '../../../Utility/string';
import {PointsTab} from './PointsTab';
import {QuizTab} from './QuizTab';
import {UserTab} from './UserTab';

const TabId = {
	USER: 'user',
	QUIZ: 'quiz',
	POINTS: 'points',
};

interface RouteProps {
	user: string,
}

type Props = RouteComponentProps<RouteProps>;

interface State {
	user: User | null,
	redirectTo: string | null,
	activeTab: string,
}

export class UserEditor extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			user: null,
			redirectTo: null,
			activeTab: getInitialTabId(),
		};
	}

	public async componentDidMount() {
		try {
			this.setState({
				user: await UserModel.read(this.props.match.params.user)
					.then(r => r.data),
			});
		} catch {
			toaster.showUnhandledErrorMessage();

			this.setState({
				redirectTo: '/',
			});
		}
	}

	public render() {
		if (this.state.redirectTo)
			return <Redirect to={this.state.redirectTo} />;
		else if (this.state.user === null)
			return <FrameLoadingSpinner />;

		return (
			<div className={Classes.PAGE_WRAPPER}>
				<H1>{renderUserName(this.state.user)}</H1>
				<Divider />

				<Tabs selectedTabId={this.state.activeTab} onChange={this.onTabChange}>
					<Tab id={TabId.USER} title={<Link to={`/users/${this.state.user.id}`}>Basic Info</Link>} />
					<Tab id={TabId.POINTS} title={<Link to={`/users/${this.state.user.id}/points`}>Points</Link>} />
					<Tab id={TabId.QUIZ} title={<Link to={`/users/${this.state.user.id}/quiz`}>Quiz</Link>} />
				</Tabs>

				<div style={{marginTop: 10}}>
					<Switch>
						<Route path="/users/:user(\d+)" children={<UserTab user={this.state.user} />} exact={true} />

						<Route
							path="/users/:user(\d+)/points"
							children={<PointsTab user={this.state.user} />}
							exact={true}
						/>

						<Route
							path="/users/:user(\d+)/quiz"
							children={<QuizTab user={this.state.user} />}
							exact={true}
						/>
					</Switch>
				</div>
			</div>
		);
	}

	private onTabChange = (newTabId: string) => this.setState({
		activeTab: newTabId,
	});
}

function getInitialTabId(): string {
	const path = window.location.pathname;

	if (/^\/users\/\d+$/.test(path))
		return TabId.USER;
	else if (/^\/users\/\d+\/points$/.test(path))
		return TabId.POINTS;
	else if (/^\/users\/\d+\/quiz$/.test(path))
		return TabId.QUIZ;

	return '';
}
