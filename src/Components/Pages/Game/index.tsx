import {H1} from '@blueprintjs/core';
import * as React from 'react';
import {Redirect} from 'react-router';
import {Board, BoardModel} from '../../../Api/Game-Catalog/Models/Boards';
import {GamesModel, GameState, PlayerState} from '../../../Api/Game-State/Models/Games';
import {UserContext} from '../../../Session';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {Sidebar} from './Sidebar';
import {PlayerStatsCard} from './Sidebar/PlayerStatsCard';
import {TopRankedPlayersCard} from './Sidebar/TopRankedPlayersCard';

interface IState {
	board: Board | null;
	gameState: GameState | null;
	currentPlayer: PlayerState | null;
	loading: boolean;
	redirect: boolean;
}

export class GameBoardPage extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		board: null,
		gameState: null,
		currentPlayer: null,
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

		let board: Board;

		try {
			board = await BoardModel.read(gameState.current_board.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				redirect: true,
			});

			return;
		}

		const currentPlayer: PlayerState | null = this.getCurrentPlayer(gameState.players);

		this.setState({
			board,
			gameState,
			currentPlayer,
			loading: false,
		});
	}

	public render() {
		if (this.state.redirect) return <Redirect to="/" />;
		if (this.state.loading) return <FrameLoadingSpinner />;

		return (
			<div style={{display: 'grid', gridTemplateColumns: '5fr 2fr'}}>
				<H1>Game Board</H1>

				<Sidebar>
					<TopRankedPlayersCard players={this.state.gameState!.players} />

					<PlayerStatsCard player={this.state.currentPlayer} />
				</Sidebar>
			</div>
		);
	}

	private getCurrentPlayer(players: PlayerState[]) {
		return players.find(player => player.hub_id === this.context!.id) || null;
	}
}
