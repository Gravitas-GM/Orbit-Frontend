import { Board } from "../Api/Game-Catalog/Models/Boards"
export const catalogGameBoardMock: Board = {
	id: 1,
	game: 1,
	name: 'Majora\'s Mask',
	sequence: 1,
	imageUrl: 'https://tinyurl.com/5ff4pkf5',
	stages: [
		{
			id: 1,
			name: 'Clock Town',
			board: 1,
			requiredPoints: 5,
			boardRegion: {
				x: 150,
				y: 365,
				width: 100,
				height: 150,
			},
		},
		{
			id: 2,
			name: 'Termina Field',
			board: 1,
			requiredPoints: 100,
			boardRegion: {
				x: 600,
				y: 405,
				width: 100,
				height: 150,
			},
		},
		{
			id: 3,
			name: 'Woodfall',
			board: 1,
			requiredPoints: 200,
			boardRegion: {
				x: 1150,
				y: 600,
				width: 100,
				height: 150,
			},
		}
	],
}