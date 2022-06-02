import {NonIdealState} from '@blueprintjs/core';
import * as React from 'react';
import {Link} from 'react-router-dom';

export const PageNotFound: React.FC = () => (
	<div style={{margin: '0 auto', padding: '30px 10px'}}>
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

PageNotFound.displayName = 'PageNotFound';
