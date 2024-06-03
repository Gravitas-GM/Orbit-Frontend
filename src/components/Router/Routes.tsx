import {ReactElement} from 'react';
import {Navigate, Route, Routes as BaseRoutes, RoutesProps} from 'react-router-dom';

export function Routes({children, ...props}: RoutesProps): ReactElement {
	return (
		<BaseRoutes {...props}>
			{children}

			<Route path="*" element={<Navigate to="/404" replace={true} />} />
		</BaseRoutes>
	);
}
