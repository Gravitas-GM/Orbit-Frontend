import {PlayerUpdate, UpdateResultType} from '../Api/Game-State/Models/Games';
import {playersMock} from './Player';
import {stageMock, stagesMock} from './Stage';

export const playerUpdateMock: PlayerUpdate[] = [
	{
		type: UpdateResultType.CREATED,
		player: playersMock[0],
		initial_stage: stageMock,
		history_item: {
			id: {$oid: 'id'},
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
		new_stage: {
			index: 123,
			stage: stagesMock[2],
		},
		history_item: {
			id: {$oid: 'id'},
			account_id: 1,
			timestamp: new Date(),
			content: 'Moved to Los Angeles',
		},
	},
	{
		type: UpdateResultType.DELETED,
		player: playersMock[3],
	},
];