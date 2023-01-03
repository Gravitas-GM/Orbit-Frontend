import {Button, H2} from '@blueprintjs/core';
import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { Game, GameModel } from '../../../Api/Game-Catalog/Models/Games';
import { UserContext } from '../../../Session';
import * as toaster from '../../../Toaster';
import { FrameLoadingSpinner } from '../../FrameLoadingSpinner';
import {ucwords} from '../../Utility/string';
import {BoardInfoCard} from './BoardInfoCard';

interface IRouteProps {
	game: string;
}

interface IState {
	game: Game | null;
	loading: boolean;
	redirect: boolean;
}

export class GameInfo extends React.PureComponent<RouteComponentProps<IRouteProps>, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		game: null,
		loading: true,
		redirect: false,
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
						src={this.state.game!.thumbnailUrl ?? 'https://i.imgur.com/6Y1ocrb.png'}
						alt={`${this.state.game!.name} image`}
						width="150"
					/>

					<div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 20 }}>
						<H2>{ucwords(this.state.game!.name)}</H2>

						<span>{this.state.game!.description}</span>

						{/*TODO: implement start button*/}
						<Button>Start Game</Button>
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
}
