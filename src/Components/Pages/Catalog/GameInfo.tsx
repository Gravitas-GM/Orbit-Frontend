import {Button, H2, Intent} from '@blueprintjs/core';
import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { Game } from '../../../Api/Game-Catalog/Models/Games';
import { GamesModel } from '../../../Api/Game-State/Models/Games';
import { UserContext } from '../../../Session';
import * as toaster from '../../../Toaster';
import { FrameLoadingSpinner } from '../../FrameLoadingSpinner';
import { ucwords } from '../../Utility/string';
import { BoardInfoCard } from './BoardInfoCard';
import { StartGameDialog } from './StartGameDialog';
import ImageNotFound from '../../../Assets/ImageNotFound.png';
import { gameMock } from '../../../mocks/Game';
import { Link } from 'react-router-dom';

interface IRouteProps {
	game: string;
}

interface IState {
	game: Game | null;
	loading: boolean;
	redirect: boolean;
	processing: boolean;
	showStartGameDialog: boolean;
}

export class GameInfo extends React.PureComponent<RouteComponentProps<IRouteProps>, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		game: null,
		loading: true,
		redirect: false,
		processing: false,
		showStartGameDialog: false,
	};

	public async componentDidMount() {
		const idParam = this.props.match.params.game;

		let game: Game;

		try {
			// game = await GameModel.read(idParam).then(response => response.data);
			 game = gameMock
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				redirect: true,
			});

			return;
		}

		this.setState({
			game,
			loading: false,
		});
	}

	public render() {
		if (this.state.redirect)
			return <Redirect to="/catalog" />;
		else if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<div style={{ display: 'flex', flexDirection: 'column', width: '75vw', margin: '0 auto', paddingTop: '1rem' }}>
				<div style={{ marginBottom: '2rem' }}><Link to="/catalog">Catalog</Link> &gt; { ucwords(this.state.game!.name) }</div>
				<div style={{ display: 'flex', gap: '2rem' }}>
					<img
						src={this.state.game!.thumbnailUrl ?? ImageNotFound}
						alt={`${this.state.game!.name} image`}
						width="450"
						style={{ borderRadius: '0.25rem'}}
					/>

					<div>
						<H2>{ucwords(this.state.game!.name)}</H2>

						<p style={{ paddingBottom: 20, fontSize: '1.2rem', lineHeight: '150%' }}>
							{this.state.game!.description}
						</p>

						{/*TODO: Implement start game confirmation dialog*/}
						<Button
							text="Start Game"
							intent={Intent.PRIMARY}
							onClick={this.onStartGameButtonClick}
							loading={this.state.processing}
						/>
					</div>
				</div>

				<h3 style={{ fontSize: '2rem', paddingTop: 20 }}>Boards</h3>

				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>

					{this.state.game!.boards.map(board => (
						<BoardInfoCard board={board} key={board.id} />
					))}
				</div>

				<StartGameDialog
					game={this.state.game!}
					isOpen={this.state.showStartGameDialog}
					onCancel={this.onStartGameDialogClose}
					onConfirm={this.confirmStartGame}
					processing={this.state.processing}
				/>
			</div>
		);
	}
	private onStartGameButtonClick = () => {
		this.setState({
			showStartGameDialog: true
		});
	}

	private onStartGameDialogClose = () => {
		this.setState({
			showStartGameDialog: false
		});
	}

	private confirmStartGame = async () => {
		this.setState({
			processing: true,
		});

		try {
			await GamesModel.startGame(
				this.context!.account.id,
				{
					catalog_id: this.state.game!.id
				}
			);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				processing: false,
			});

			return;
		}

		toaster.success(`${ucwords(this.state.game!.name)} started.`);

		this.setState({
			processing: false,
		});
	}
}
