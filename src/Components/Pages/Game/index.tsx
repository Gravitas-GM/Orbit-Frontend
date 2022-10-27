import {H1} from '@blueprintjs/core';
import * as React from 'react';
import {Redirect} from 'react-router';
import {GamesModel, GameState} from '../../../Api/Game-State/Models/Games';
import {UserContext} from '../../../Session';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';

interface IState {
	gameState: GameState | null;
	loading: boolean;
	redirect: boolean;
}

export class GameBoard extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		gameState: null,
		loading: true,
		redirect: false,
	};

	public async componentDidMount() {
		let gameState: GameState;

		try {
			gameState = await GamesModel.gameInfo(this.context!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				redirect: true,
			});

			return;
		}

		this.setState({
			gameState,
			loading: false,
		});
	}

	public render() {
		if (this.state.redirect)
			return <Redirect to="/" />;
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<H1>Game Board</H1>
		);
	}
}
