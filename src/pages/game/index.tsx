import * as React from 'react';
import {Route, Routes} from 'react-router-dom';
import {Permission} from '../../api/permissions';
import {withPermissionRestriction} from '../../components/Router/withPermissionRestriction';
import {GameBoard} from './Board';
import {CatalogListPage} from './Catalog';
import {GameInfo} from './Catalog/GameInfo';
import {Leaderboard} from './Leaderboard';
import {SourcesList} from './Sources';

export function GameRoutes(): React.ReactElement {
	return (
		<Routes>
			<Route index={true} element={<GameBoard />} />

			<Route path="leaderboard" element={<Leaderboard />} />

			{withPermissionRestriction(Permission.Admin, (
				<>
					<Route path="catalog" element={<CatalogListPage />} />
					<Route path="catalog/:game" element={<GameInfo />} />

					<Route path="sources" element={<SourcesList />} />
				</>
			))}
		</Routes>
	);
}
