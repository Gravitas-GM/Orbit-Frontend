import * as React from 'react';
import {Layout} from './Components/Layout';

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
				<Layout loading={this.state.loading} />
			</div>
		);
	}
}
