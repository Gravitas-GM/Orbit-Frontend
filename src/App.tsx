import * as React from 'react';
import {Route, Router, Switch} from 'react-router';
import {tokenStorage} from './Api';
import {User, UserModel} from './Api/Hub/Models/Users';
import {Activate} from './Components/Auth/Activate';
import {Login} from './Components/Auth/Login';
import {PasswordReset} from './Components/Auth/PasswordReset';
import {Layout} from './Components/Layout';
import {history} from './history';
import {isGranted, Permission, PermissionCheckCallback, PermissionContext} from './Permission';
import {PrivateRoute} from './PrivateRoute';
import {UserContext} from './Session';

interface IState {
	loading: boolean;
	user: User | null;
	permissions: Set<Permission>;
}

export class App extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: true,
		user: null,
		permissions: new Set<Permission>(),
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

			this.initPermissions(response.data);
		});
	}

	public render(): JSX.Element {
		return (
			<div id="app-root">
				<UserContext.Provider value={this.state.user}>
					<PermissionContext.Provider value={[this.isPermissionGranted, this.state.permissions]}>
						<Router history={history}>
							<Switch>
								<Route path="/login">
									<Login onLoginSuccess={this.onUserChange} />
								</Route>

								<Route path="/activate">
									<Activate />
								</Route>

								<Route path="/password-reset">
									<PasswordReset />
								</Route>

								<PrivateRoute path="/">
									<Layout loading={this.state.loading} />
								</PrivateRoute>
							</Switch>
						</Router>
					</PermissionContext.Provider>
				</UserContext.Provider>
			</div>
		);
	}

	private onUserChange = (user: User) => {
		this.setState({
			user,
			loading: true,
		});

		this.initPermissions(user);
	};

	private isPermissionGranted: PermissionCheckCallback = (match) => isGranted(this.state.permissions, match);

	private initPermissions = (user: User) => {
		const permissions = new Set<Permission>();

		for (const permission of (user.permissions)) {
			if (permission === Permission.ADMIN) {
				permissions.clear();
				permissions.add(permission);

				break;
			}

			permissions.add(permission);
		}

		this.setState({
			permissions,
			loading: false,
		});
	};
}
