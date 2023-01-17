import { HistoryItem } from '../Api/Game-State/Models/History';

export const historyItemMock: HistoryItem = {
	id: { $oid: 'object_id' },
	account_id: 12,
	timestamp: new Date(),
	content: 'Moved to Los Angeles',
};