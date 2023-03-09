import {gameStateClient, Id} from '../..';
import {ObjectId} from '../../Point-Tracking';

export interface HistoryEndpoints {
	'/history/:account': {
		GET: {
			params: Id;
			response: HistoryItem[];
		};
	};

	'/history/:account/:afterId': {
		GET: {
			params: Id;
			response: HistoryItem[];
		};
	};
}

export interface HistoryItem {
	id: ObjectId;
	account_id: number;
	timestamp: Date;
	content: string;
}

export class HistoryModel {
	public static get(account: Id) {
		return gameStateClient.get<'/history/:account'>(`/history/${account}`);
	}

	public static getAfter(account: Id, afterId: ObjectId) {
		return gameStateClient.get<'/history/:account/:afterId'>(`/history/${account}/${afterId.$oid}`);
	}
}
