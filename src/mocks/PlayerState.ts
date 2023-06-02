import {PlayerState} from '../Api/Game-State/Models/Games';
import {playersMock} from './Player';
import {stagesMock} from './Stage';

export const playerStateMock: PlayerState[] = [
	{
		current_points: 10,
		current_stage_id: stagesMock[0].id,
		current_stage_name: stagesMock[0].name,
		hub_id: playersMock[0].hub_id,
		user_name: playersMock[0].user_name,
	},
	{
		current_points: 100,
		current_stage_id: stagesMock[1].id,
		current_stage_name: stagesMock[1].name,
		hub_id: playersMock[4].hub_id,
		user_name: playersMock[4].user_name,
	},
	{
		current_points: 120,
		current_stage_id: stagesMock[1].id,
		current_stage_name: stagesMock[1].name,
		hub_id: playersMock[2].hub_id,
		user_name: playersMock[2].user_name,
	},
	{
		current_points: 555,
		current_stage_id: stagesMock[2].id,
		current_stage_name: stagesMock[2].name,
		hub_id: playersMock[3].hub_id,
		user_name: playersMock[3].user_name,
	},
];