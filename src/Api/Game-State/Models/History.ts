import {gameStateClient, Id} from '../..';
import {parseApiTimestamp} from '../../../Components/Utility/date';
import {ObjectId} from '../../Point-Tracking';

export interface HistoryEndpoints {
	'/history/:account': {
		GET: {
			params: Id;
			response: HistoryItem[];
		};
	};

	'/history/:account/:beforeId': {
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
		return gameStateClient.get<'/history/:account'>(`/history/${account}`).then(response => {
			response.data = response.data.map(denormalizeHistoryItem);

			return response;
		});
	}

	public static getBefore(account: Id, beforeId: ObjectId) {
		return gameStateClient.get<'/history/:account/:beforeId'>(`/history/${account}/${beforeId.$oid}`)
			.then(response => {
				response.data = response.data.map(denormalizeHistoryItem);

				return response;
			});
	}
}

export function denormalizeHistoryItem(historyItem: HistoryItem) {
	historyItem.timestamp = parseApiTimestamp(historyItem.timestamp);

	return historyItem;
}
