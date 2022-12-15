import { Stage } from '../Api/Game-Catalog/Models/Stages';

export const stageMock: Stage = {
	id: 1,
	name: 'Start',
	board: 123,
	requiredPoints: 0,
	boardRegion: {
		x: 10,
		y: 10,
		width: 132,
		height: 120,
	},
};

export const stagesMock: Stage[] = [
	{
		id: 1,
		name: 'Start',
		board: 123,
		requiredPoints: 0,
		boardRegion: {
			x: 10,
			y: 10,
			width: 132,
			height: 120,
		},
	},
	{
		id: 2,
		name: 'Semi final stage',
		board: 123,
		requiredPoints: 23,
		boardRegion: {
			x: 10,
			y: 10,
			width: 132,
			height: 120,
		},
	},
	{
		id: 3,
		name: 'Final stage',
		board: 123,
		requiredPoints: 94,
		boardRegion: {
			x: 10,
			y: 10,
			width: 132,
			height: 120,
		},
	},
];
