import {NonIdealState} from '@blueprintjs/core';
import {ReactElement} from 'react';
import {Link} from 'react-router-dom';

import {useTitle} from '../../hooks/useTitle';
import {Spacing} from '../../Styles/variables';

export function NotFound(): ReactElement {
	useTitle("Not Found");

	return (
		<div
			style={{
				margin: '0 auto',
				padding: `${Spacing.XLarge} ${Spacing.Medium}`,
			}}
		>
			<NonIdealState
				icon="help"
				title="Page Not Found"
				description={(
					<span>
					<p>The page you requested could not be found, or you do not have permission to access it.</p>

					<p><Link to="/">Click here</Link> to return to the home page.</p>
				</span>
				)}
			/>
		</div>
	);
}
