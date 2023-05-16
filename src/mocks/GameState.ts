import {GameState} from '../Api/Game-State/Models/Games';
import {boardMock} from './Board';
import {playerStateMock} from './PlayerState';

export const gameStateMock: GameState = {
	name: 'Game Mock',
	account_id: 123,
	catalog_id: 456,
	current_board: boardMock,
	players: playerStateMock,
};