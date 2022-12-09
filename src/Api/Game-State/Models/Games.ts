import {gameStateClient, Id} from '../..';
import {HistoryItem} from './History';

export interface GamesEndpoints {
	'/games/accounts/:account': {
		GET: {
			params: Id;
			response: GameState;
		};

		PUT: {
			params: Id;
			body: GameStartPayload;
			response: GameState | GameNotFoundResponse;
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

	'/games/accounts/:account/next': {
		POST: {
			params: Id;
			response: NextBoardResult;
		};
	}
}

export enum UpdateResultType {
	CREATED = 'created',
	CHANGED = 'changed',
	MOVED = 'moved',
	DELETED = 'deleted',
}

export interface PlayerCreated {
	type: UpdateResultType.CREATED,
	player: Player,
	history_item: HistoryItem,
}

export interface PlayerChanged {
	type: UpdateResultType.CHANGED,
	player: Player,
	new_point_total: number,
}

export interface PlayerMoved {
	type: UpdateResultType.MOVED,
	player: Player,
	new_point_total: number,
	new_stage_index: number,
	history_item: HistoryItem,
}

export interface PlayerDeleted {
	type: UpdateResultType.DELETED,
	player_id: number,
}

export type PlayerUpdate = PlayerCreated | PlayerChanged | PlayerMoved | PlayerDeleted;

export interface GameState {
	name: string,
	account_id: Id,
	catalog_id: Id,
	current_board: Board,
	players: PlayerState[],
}

export interface Player {
	hub_id: number,
	account_id: number,
	user_name: string,
	current_stage_index: number,
	current_points: number,
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

export enum NextBoardResult {
	Success,
	NoActiveGame,
	NoRemainingBoards,
	BoardNotFound,
}

export interface GameNotFoundResponse {
	error: string;
}

export interface GameStartPayload {
	catalog_id: number,
}

export class GamesModel {
	public static gameInfo(account: Id) {
		return gameStateClient.get<'/games/accounts/:account'>(`/games/accounts/${account}`);
	}

	public static startGame(account: Id, payload: GameStartPayload) {
		return gameStateClient.put<'/games/accounts/:account'>(`/games/accounts/${account}`, payload);
	}

	public static update(account: Id) {
		return gameStateClient.post<'/games/accounts/:account/update'>(`/games/accounts/${account}/update`);
	}

	public static updatePreview(account: Id) {
		return gameStateClient.get<'/games/accounts/:account/update'>(`/games/accounts/${account}/update`);
	}

	public static nextBoard(account: Id) {
		return gameStateClient.post<'/games/accounts/:account/next'>(`/games/accounts/${account}/next`);
	}
}
