import {Divider, H1, Tab, Tabs} from '@blueprintjs/core';
import * as React from 'react';
import {Link, Navigate, Route, Routes} from 'react-router-dom';
import {User, UserModel} from '../../../Api/Hub/Models/Users';
import {Classes} from '../../../classes';
import {FrameLoadingSpinner} from '../../../Components/FrameLoadingSpinner';
import {withRouteParams, WithRouteParamsProps} from '../../../Components/Router/withRouteParams';
import {toaster} from '../../../toaster';
import {renderUserName} from '../../../utility/string';
import {PointsTab} from './Points';
import {QuizTab} from './Quiz';
import {UserTab} from './UserTab';

const TabId = {
	USER: 'user',
	QUIZ: 'quiz',
	POINTS: 'points',
};

interface RouteParams {
	user: string,
}

type Props = WithRouteParamsProps<RouteParams>;

interface State {
	user: User | null,
	redirectTo: string | null,
	activeTab: string,
}

class UserEditor extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			user: null,
			redirectTo: null,
			activeTab: getInitialTabId(),
		};
	}

	public async componentDidMount() {
		const id = this.props.params.user;

		if (!id)
			throw new Error('Missing required route parameter `user`');

		try {
			this.setState({
				user: await UserModel.read(id).then(r => r.data),
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
			return <Navigate to={this.state.redirectTo} />;
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
					<Routes>
						<Route index={true} element={<UserTab user={this.state.user} />} />
						<Route path="points" element={<PointsTab user={this.state.user} />} />
						<Route path="quiz" element={<QuizTab user={this.state.user} />} />
					</Routes>
				</div>
			</div>
		);
	}

	private onTabChange = (newTabId: string) => this.setState({
		activeTab: newTabId,
	});
}

const Wrapped = withRouteParams(UserEditor);
export {Wrapped as UserEditor};

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
