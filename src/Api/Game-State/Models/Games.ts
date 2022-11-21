import {gameStateClient, Id} from '../..';

export interface GamesEndpoints {
	'/games/accounts/:account': {
		GET: {
			params: Id;
			response: GameState;
		};
	};

	'/games/accounts/:account/update': {
		GET: {
			params: Id;
			response: PlayerUpdate[];
		};

		POST: {
			params: Id;
			response: PlayerUpdate[];
		};
	}
}

export interface PlayerUpdate {
	player_id: number,
	new_stage_id: number,
	new_point_total: number,
}

export interface GameState {
	name: string,
	account_id: Id,
	catalog_id: Id,
	current_board: Board,
	players: PlayerState[],
}

export interface PlayerState {
	hub_id: Id,
	user_name: string,
	current_stage_id: Id,
	current_stage_name: string,
	current_points: number,
}

export interface Board {
	id: Id,
	name: string,
	sequence: number,
}

export class GamesModel {
	public static gameInfo(account: Id) {
		return gameStateClient.get<'/games/accounts/:account'>(`/games/accounts/${account}`);
	}

	public static update(account: Id) {
		return gameStateClient.post<'/games/accounts/:account/update'>(`/games/accounts/${account}/update`);
	}

	public static updatePreview(account: Id) {
		return gameStateClient.get<'/games/accounts/:account/update'>(`/games/accounts/${account}/update`);
	}
}
