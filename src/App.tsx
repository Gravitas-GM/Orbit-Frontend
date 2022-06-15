import * as React from 'react';
import {Route, Router, Switch} from 'react-router';
import {tokenStorage} from './Api';
import {User, UserModel} from './Api/Hub/Models/Users';
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
		loading: true,
		user: null,
	};

	public componentDidMount() {
		const userId = tokenStorage.getToken()?.body.id;

		if (!userId) {
			this.setState({
				loading: false,
			});

			return;
		}

		UserModel.read(userId).then(response => {
			this.setState({
				user: response.data,
				loading: false,
			});
		});
	}

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

	private onUserChange = (user: User) => this.setState({
		user,
	});
}
