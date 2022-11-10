import * as React from 'react';
import {Redirect} from 'react-router';
import {Board, BoardModel} from '../../../Api/Game-Catalog/Models/Boards';
import {GamesModel, GameState, PlayerState} from '../../../Api/Game-State/Models/Games';
import {UserContext} from '../../../Session';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {GameAnnouncement} from './Board/GameAnnouncement';
import {GameBoard} from './Board/GameBoard';
import {Sidebar} from './Sidebar';

interface IState {
	board: Board | null;
	gameState: GameState | null;
	playerToMove: PlayerState | null;
	loading: boolean;
	redirect: boolean;
}

export class GameBoardPage extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		board: null,
		gameState: null,
		playerToMove: null,
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

		this.setState({
			board,
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
			//NOTE: using div styling from feature/log-history-card branch so the Sidebar can exist
			<div style={{display: 'grid', gridTemplateColumns: '5fr 2fr'}}>
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<GameBoard board={this.state.board!} gameState={this.state.gameState!} />

					{/*TODO: When the player movement control code sets a new player, this will reset the animation*/}
					{this.state.playerToMove && (
						<GameAnnouncement player={this.state.playerToMove} />
					)}
				</div>

				<Sidebar>
					{/*TODO: implement sidebar game cards*/}
				</Sidebar>
			</div>
		);
	}
}
