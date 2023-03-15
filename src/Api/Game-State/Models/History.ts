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
		return gameStateClient.get<'/history/:account'>(`/history/${account}`).then(response => {
			response.data = response.data.map(this.denormalizeHistoryItem);

			return response;
		});
	}

	public static getAfter(account: Id, afterId: ObjectId) {
		return gameStateClient.get<'/history/:account/:afterId'>(`/history/${account}/${afterId.$oid}`)
			.then(response => {
				response.data = response.data.map(this.denormalizeHistoryItem);

				return response;
			});
	}

	private static denormalizeHistoryItem(historyItem: HistoryItem) {
		historyItem.timestamp = parseApiTimestamp(historyItem.timestamp);

		return historyItem;
	}
}
