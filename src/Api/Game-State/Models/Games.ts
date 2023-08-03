import {gameStateClient, Id} from '../..';
import {Stage} from '../../Game-Catalog/Models/Stages';
import {denormalizeHistoryItem, HistoryItem} from './History';

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

		DELETE: {
			params: Id;
			response: void;
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
			response: void;
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
	initial_stage: StageDescriptor,
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
	new_stage: StageDescriptor,
	history_item: HistoryItem,
}

export interface PlayerDeleted {
	type: UpdateResultType.DELETED,
	player: Player,
}

export type PlayerUpdate = PlayerCreated | PlayerChanged | PlayerMoved | PlayerDeleted;

export interface Player {
	hub_id: number,
	account_id: number,
	user_name: string,
	current_stage_index: number,
	current_points: number,
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

export interface StageDescriptor {
	stage: Stage,
	index: number,
}

export interface Board {
	id: Id,
	name: string,
	sequence: number,
}

export enum NextBoardResult {
	Success = 204,
	NoActiveGame = 404,
	NoRemainingBoards = 400,
	BoardNotFound = 500,
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
		return gameStateClient.post<'/games/accounts/:account/update'>(`/games/accounts/${account}/update`)
			.then(response => {
				response.data = response.data.map(GamesModel.denormalizePlayerUpdate);

				return response;
			});
	}

	public static updatePreview(account: Id) {
		return gameStateClient.get<'/games/accounts/:account/update'>(`/games/accounts/${account}/update`)
			.then(response => {
				response.data = response.data.map(GamesModel.denormalizePlayerUpdate);

				return response;
			});
	}

	public static nextBoard(account: Id) {
		return gameStateClient.post<'/games/accounts/:account/next'>(`/games/accounts/${account}/next`);
	}

	public static deleteGameState(accountId: Id) {
		return gameStateClient.delete<'/games/accounts/:account'>(`/games/accounts/${accountId}`);
	}

	private static denormalizePlayerUpdate(playerUpdate: PlayerUpdate) {
		if (playerUpdate.type === UpdateResultType.CREATED || playerUpdate.type === UpdateResultType.MOVED)
			playerUpdate.history_item = denormalizeHistoryItem(playerUpdate.history_item);

		return playerUpdate;
	}
}

export function isGameStartError(value: any): value is GameNotFoundResponse {
	return typeof value === 'object' && typeof value.error !== 'undefined';
}

export function getNewPointsFromPlayerUpdate(update: PlayerUpdate): number {
	switch (update.type) {
		case UpdateResultType.CHANGED:
		case UpdateResultType.MOVED:
			return update.new_point_total;

		case UpdateResultType.CREATED:
			return update.player.current_points;

		case UpdateResultType.DELETED:
			return 0;
	}
}