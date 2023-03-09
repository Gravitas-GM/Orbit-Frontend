import { Game } from "../Api/Game-Catalog/Models/Games"
import { catalogGameBoardMock } from "./GameBoard"

export const gameMock: Game = {
	id: 1,
	name: 'Zelda',
	description: 'About a hundred years from the present, Ganon returns. The new king tried to use the Sheikah technology again to defeat Ganon. However, Ganon already controlled Sheikah technology and he used this to attack the kingdom. As a consequence, Link and princess Zelda were defeated by Sheikah technology. Link had to recover for a hundred years and when he woke up in the Shrine of Resurrection, and the game starts. He now has to return in search of Zelda to help her destroy Ganon with the help of clues Zelda left along the way.',
	publishedDate: null,
	hidden: false,
	boards: [catalogGameBoardMock, catalogGameBoardMock,catalogGameBoardMock, catalogGameBoardMock, catalogGameBoardMock,
		catalogGameBoardMock, catalogGameBoardMock,catalogGameBoardMock, catalogGameBoardMock, catalogGameBoardMock],
	thumbnailUrl: 'https://images.nintendolife.com/880243a8baed2/switch-tloz-totk-artwork-01.large.jpg',
}

export const catalogGamesMock: Game[] = [{
	id: 1,
	name: 'Zelda',
	description: 'About a hundred years from the present, Ganon returns. The new king tried to use the Sheikah technology again to defeat Ganon. However, Ganon already controlled Sheikah technology and he used this to attack the kingdom. As a consequence, Link and princess Zelda were defeated by Sheikah technology. Link had to recover for a hundred years and when he woke up in the Shrine of Resurrection, and the game starts. He now has to return in search of Zelda to help her destroy Ganon with the help of clues Zelda left along the way.',
	publishedDate: null,
	hidden: false,
	boards: [catalogGameBoardMock, catalogGameBoardMock,catalogGameBoardMock, catalogGameBoardMock, catalogGameBoardMock,
		catalogGameBoardMock, catalogGameBoardMock,catalogGameBoardMock, catalogGameBoardMock, catalogGameBoardMock],
	thumbnailUrl: 'https://images.nintendolife.com/880243a8baed2/switch-tloz-totk-artwork-01.large.jpg',
},

{
	id: 1,
	name: 'Zelda',
	description: 'As a consequence, Link and princess Zelda were defeated by Sheikah technology. Link had to recover for a hundred years and when he woke up in the Shrine of Resurrection, and the game starts. He now has to return in search of Zelda to help her destroy Ganon with the help of clues Zelda left along the way.',
	publishedDate: null,
	hidden: false,
	boards: [catalogGameBoardMock, catalogGameBoardMock,catalogGameBoardMock, catalogGameBoardMock, catalogGameBoardMock,
		catalogGameBoardMock, catalogGameBoardMock,catalogGameBoardMock, catalogGameBoardMock, catalogGameBoardMock],
	thumbnailUrl: 'https://images.nintendolife.com/880243a8baed2/switch-tloz-totk-artwork-01.large.jpg',
},

{
	id: 1,
	name: 'Zelda',
	description: 'Link had to recover for a hundred years and when he woke up in the Shrine of Resurrection, and the game starts.',
	publishedDate: null,
	hidden: false,
	boards: [catalogGameBoardMock, catalogGameBoardMock,catalogGameBoardMock, catalogGameBoardMock, catalogGameBoardMock,
		catalogGameBoardMock, catalogGameBoardMock,catalogGameBoardMock, catalogGameBoardMock, catalogGameBoardMock],
	thumbnailUrl: 'https://images.nintendolife.com/880243a8baed2/switch-tloz-totk-artwork-01.large.jpg',
}
];