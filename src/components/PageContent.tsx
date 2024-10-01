import {ReactElement, ReactNode} from 'react';
import {Classes} from '../classes';

interface Props {
	children: ReactNode,
}

export function PageContent({children}: Props): ReactElement {
	return (
		<div className={Classes.PAGE_WRAPPER}>
			{children}
		</div>
	);
}
