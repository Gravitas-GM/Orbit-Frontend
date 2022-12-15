import { PlayerUpdate, UpdateResultType } from '../Api/Game-State/Models/Games';
import { playersMock } from './Player';
export const playerUpdateMock: PlayerUpdate[] = [
	{
		type: UpdateResultType.CREATED,
		player: playersMock[0],
		history_item: {
			id: { $oid: 'id' },
			account_id: 12,
			timestamp: new Date(),
			content: 'Moved to Colorado',
		},
	},
	{
		type: UpdateResultType.CHANGED,
		player: playersMock[1],
		new_point_total: 110,
	},
	{
		type: UpdateResultType.MOVED,
		player: playersMock[2],
		new_point_total: 120,
		new_stage_index: 2,
		history_item: {
			id: { $oid: 'id' },
			account_id: 1,
			timestamp: new Date(),
			content: 'Moved to Los Angeles',
		},
	},
	{
		type: UpdateResultType.DELETED,
		player_id: playersMock[3].hub_id,
	},
];
