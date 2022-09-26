import {gameCatalogClient, Id} from '../..';

export interface StageEndpoints {
	'/stages/:id': {
		GET: {
			params: Id;
			response: Stage;
		};
	};
}

export interface BoardRegion {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface Stage {
	id: number;
	name: string;
	board: number;
	requiredPoints: number;
	boardRegion: BoardRegion;
}

export class StageModel {
	public static read(stage: Id) {
		return gameCatalogClient.get<'/stages/:id'>(`/stages/${stage}`);
	}
}
