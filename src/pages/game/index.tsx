import * as React from 'react';
import {Route, Routes} from 'react-router-dom';
import {GameBoard} from './Board';

export function GameRoutes(): React.ReactElement {
	return (
		<Routes>
			<Route index={true} element={<GameBoard />} />
		</Routes>
	);
}
