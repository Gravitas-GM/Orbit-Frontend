import { Board } from '../Api/Game-Catalog/Models/Boards';
import { stagesMock } from './Stage';

export const boardMock: Board = {
	id: 123,
	name: '123',
	sequence: 3,
	game: 1,
	imageUrl: '',
	stages: stagesMock,
};
