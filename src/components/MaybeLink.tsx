import * as React from 'react';
import {Link, LinkProps} from 'react-router-dom';

interface Props {
	children: React.ReactNode,
	to?: LinkProps['to'],
}

export function MaybeLink({to, children}: Props): React.ReactElement {
	if (!to)
		return <>{children}</>;

	return (
		<Link to={to}>
			{children}
		</Link>
	);
}
