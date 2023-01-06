import {Button, H2, Intent} from '@blueprintjs/core';
import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { Game, GameModel } from '../../../Api/Game-Catalog/Models/Games';
import { GamesModel } from '../../../Api/Game-State/Models/Games';
import { UserContext } from '../../../Session';
import * as toaster from '../../../Toaster';
import { FrameLoadingSpinner } from '../../FrameLoadingSpinner';
import { ucwords } from '../../Utility/string';
import { BoardInfoCard } from './BoardInfoCard';
import ImageNotFound from '../../../Assets/ImageNotFound.png';

interface IRouteProps {
	game: string;
}

interface IState {
	game: Game | null;
	loading: boolean;
	redirect: boolean;
	processing: boolean;
}

export class GameInfo extends React.PureComponent<RouteComponentProps<IRouteProps>, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		game: null,
		loading: true,
		redirect: false,
		processing: false,
	};

	public async componentDidMount() {
		const idParam = this.props.match.params.game;

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
			loading: false,
		});
	}

	public render() {
		if (this.state.redirect)
			return <Redirect to="/catalog" />;
		else if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div style={{ display: 'flex' }}>
					<img
						src={this.state.game!.thumbnailUrl ?? ImageNotFound}
						alt={`${this.state.game!.name} image`}
						width="150"
					/>

					<div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 20 }}>
						<H2>{ucwords(this.state.game!.name)}</H2>

						<span style={{ paddingBottom: 20 }}>
							{this.state.game!.description}
						</span>

						{/*TODO: Implement start game confirmation dialog*/}
						<Button
							text="Start Game"
							intent={Intent.PRIMARY}
							onClick={this.onStartGameButtonClick}
							loading={this.state.processing}
						/>
					</div>
				</div>

				<div style={{ display: 'flex', paddingTop: 20 }}>
					{this.state.game!.boards.map(board => (
						<BoardInfoCard board={board} />
					))}
				</div>
			</div>
		);
	}

	private onStartGameButtonClick = async () => {
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
		})
	}
}
