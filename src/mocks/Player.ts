import { Player } from '../Api/Game-State/Models/Games';

export const singlePlayerMock: Player = {
	hub_id: 3333,
	account_id: 3,
	user_name: 'Bilbo Baggins',
	current_stage_index: 0,
	current_points: 10,
};

export const playersMock: Player[] = [
	{
		hub_id: 3333,
		account_id: 3,
		user_name: 'Bilbo Baggins',
		current_stage_index: 0,
		current_points: 10,
	},
	{
		hub_id: 2222,
		account_id: 2,
		user_name: 'Frodo Baggins',
		current_stage_index: 1,
		current_points: 100,
	},
	{
		hub_id: 1111,
		account_id: 1,
		user_name: 'Sam Gamgee',
		current_stage_index: 1,
		current_points: 111,
	},
	{
		hub_id: 9999,
		account_id: 9,
		user_name: 'Gandalf the Grey',
		current_stage_index: 1,
		current_points: 0,
	},
	{
		hub_id: 5555,
		account_id: 5,
		user_name: 'Legolas the Elf',
		current_stage_index: 1,
		current_points: 5,
	},
	{
		hub_id: 4444,
		account_id: 4,
		user_name: 'Gimli the Dwarf',
		current_stage_index: 1,
		current_points: 20,
	},
	{
		hub_id: 7777,
		account_id: 7,
		user_name: 'Strider',
		current_stage_index: 1,
		current_points: 7,
	},

];
