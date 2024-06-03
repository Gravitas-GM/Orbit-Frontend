import {Button, H2, Icon, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Link, Navigate} from 'react-router-dom';
import {ApiError} from '../../../Api/errors/rocket';
import {Game, GameModel} from '../../../Api/Game-Catalog/Models/Games';
import {GamesModel} from '../../../Api/Game-State/Models/Games';
import {User} from '../../../Api/Hub/Models/Users';
import {FrameLoadingSpinner} from '../../../Components/FrameLoadingSpinner';
import {withRouteParams, WithRouteParamsProps} from '../../../Components/Router/withRouteParams';
import {withAppUser} from '../../../contexts/SessionContext';
import {Images} from '../../../Images';
import {Spacing} from '../../../Styles/variables';
import {toaster} from '../../../toaster';
import {ucwords} from '../../../utility/string';
import {BoardInfoCard} from './BoardInfoCard';
import {StartGameDialog} from './StartGameDialog';

interface RouteProps {
	game: string;
}

interface Props extends WithRouteParamsProps<RouteProps> {
	user: User,
}

interface State {
	game: Game | null;
	redirect: boolean;
	processing: boolean;
	showStartGameDialog: boolean;
}

class GameInfo extends React.PureComponent<Props, State> {
	public state: Readonly<State> = {
		game: null,
		redirect: false,
		processing: false,
		showStartGameDialog: false,
	};

	public async componentDidMount() {
		const idParam = this.props.params.game!;
		let game: Game;

		try {
			game = await GameModel.read(idParam).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				redirect: true,
			});

			return;
		}

		this.setState({
			game,
		});
	}

	public render() {
		if (this.state.redirect)
			return <Navigate to="/catalog" />;
		else if (this.state.game === null)
			return <FrameLoadingSpinner />;

		return (
			<div className="game-info-container">
				<div className="breadcrumb"><Link to="/game/catalog">Catalog</Link> &gt; {ucwords(this.state.game.name)}
				</div>
				<div className="game-info-content">
					<img
						src={this.state.game.thumbnailUrl ?? Images.NotFound}
						alt={`${this.state.game.name} image`}
						width="300"
						style={{borderRadius: Spacing.Small}}
					/>

					<div>
						<H2>{ucwords(this.state.game.name)}</H2>

						<p className="game-info-description">
							{this.state.game.description}
						</p>

						{!this.state.game.publishedDate && (
							<p className="catalog-card-under-construction">
								<Icon style={{paddingRight: 5}} icon={'build'} /> Under Construction
							</p>
						)}

						<Button
							text="Start Game"
							intent={Intent.PRIMARY}
							onClick={this.onStartGameButtonClick}
							loading={this.state.processing}
							disabled={!this.state.game.publishedDate}
						/>
					</div>
				</div>

				<h3 className="game-info-subheading">Boards</h3>

				<div className="board-list-container">
					{this.state.game.boards.map(board => (
						<BoardInfoCard board={board} key={board.id} />
					))}
				</div>

				<StartGameDialog
					game={this.state.game}
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
			showStartGameDialog: true,
		});
	};

	private onStartGameDialogClose = () => {
		this.setState({
			showStartGameDialog: false,
		});
	};

	private confirmStartGame = async () => {
		this.setState({
			processing: true,
		});

		try {
			await GamesModel.deleteGameState(this.props.user.account.id);
		} catch (error) {
			if (!(error instanceof ApiError) || !error.isNotFound()) {
				toaster.showUnhandledErrorMessage();

				this.setState({
					processing: false,
				});

				return;
			}
		}

		try {
			await GamesModel.startGame(
				this.props.user.account.id,
				{
					catalog_id: this.state.game!.id,
				},
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
			showStartGameDialog: false,
		});
	};
}

const Wrapped = withRouteParams(withAppUser(GameInfo));
export {Wrapped as GameInfo};
