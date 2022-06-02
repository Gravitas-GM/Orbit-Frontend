import * as React from 'react';
import {Route, Router, Switch} from 'react-router';
import {Layout} from './Components/Layout';
import {history} from './history';

interface IState {
	loading: boolean;
}

export class App extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: false,
	};

	public render(): JSX.Element {
		return (
			<div id="app-root">
				<Router history={history}>
					<Switch>
						<Route path="/">
							<Layout loading={this.state.loading} />
						</Route>
					</Switch>
				</Router>
			</div>
		);
	}
}
