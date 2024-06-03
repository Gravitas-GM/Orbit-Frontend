import {ReactElement} from 'react';
import {Navigate, Route} from 'react-router-dom';

export function createFallbackRoute(): ReactElement {
	return (
		<>
			<Route path="*" element={<Navigate to="/404" replace={true} />} />
		</>
	);
}
