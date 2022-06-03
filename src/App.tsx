import * as React from 'react';
import {Route, Router, Switch} from 'react-router';
import {User} from './Api/Hub/Models/Users';
import {Login} from './Components/Auth/Login';
import {Layout} from './Components/Layout';
import {history} from './history';

interface IState {
	loading: boolean;
	user: User | null;
}

export class App extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: false,
		user: null,
	};

	public render(): JSX.Element {
		return (
			<div id="app-root">
				<Router history={history}>
					<Switch>
						<Route path="/login">
							<Login onLoginSuccess={this.onUserChange} />
						</Route>

						<Route path="/">
							<Layout loading={this.state.loading} />
						</Route>
					</Switch>
				</Router>
			</div>
		);
	}

	private onUserChange = (newUser: User) => {
		this.setState({
			user: newUser,
			loading: true,
		});
	};
}
