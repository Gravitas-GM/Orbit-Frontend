import * as React from 'react';
import './index.scss';

interface Props {
	children: React.ReactNode,
}

export function Cards({children}: Props): React.ReactElement {
	return (
		<div className="cards-container">
			{children}
		</div>
	)
}
