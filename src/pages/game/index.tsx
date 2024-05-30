import * as React from 'react';
import {Route, Routes} from 'react-router-dom';
import {GameBoard} from './Board';
import {CatalogListPage} from './Catalog';
import {GameInfo} from './Catalog/GameInfo';
import {Leaderboard} from './Leaderboard';

export function GameRoutes(): React.ReactElement {
	return (
		<Routes>
			<Route index={true} element={<GameBoard />} />

			<Route path="leaderboard" element={<Leaderboard />} />

			<Route path="catalog" element={<CatalogListPage />} />
			<Route path="catalog/:game" element={<GameInfo />} />
		</Routes>
	);
}
