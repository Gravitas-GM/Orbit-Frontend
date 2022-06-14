import * as React from 'react';
import {Route, Router, Switch} from 'react-router';
import {User} from './Api/Hub/Models/Users';
import {Activate} from './Components/Auth/Activate';
import {Login} from './Components/Auth/Login';
import {Layout} from './Components/Layout';
import {history} from './history';
import {PrivateRoute} from './PrivateRoute';
import {UserContext} from './Session';

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
				<UserContext.Provider value={this.state.user}>
					<Router history={history}>
						<Switch>
							<Route path="/login">
								<Login onLoginSuccess={this.onUserChange} />
							</Route>

							<Route path="/activate">
								<Activate />
							</Route>

							<PrivateRoute path="/">
								<Layout loading={this.state.loading} />
							</PrivateRoute>
						</Switch>
					</Router>
				</UserContext.Provider>
			</div>
		);
	}

	private onUserChange = (user: User) => {
		this.setState({
			user,
		});
	};
}
