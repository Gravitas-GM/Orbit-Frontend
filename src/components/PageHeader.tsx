import {H2} from '@blueprintjs/core';
import {ComponentType, ReactElement, ReactNode} from 'react';
import './PageHeader.scss';
import {useTitle} from '../hooks/useTitle';

interface IProps {
	title?: string,
	children?: ReactNode,
	setPageTitle?: boolean,
	headerComponent?: ComponentType<{ children: ReactNode }>,
}

export function PageHeader({
	title,
	children,
	headerComponent: HeaderComponent = H2,
	setPageTitle = true,
}: IProps): ReactElement {
	useTitle(setPageTitle ? title : undefined);

	return (
		<header className="header-container">
			{title && <HeaderComponent>{title}</HeaderComponent>}
			{children}
		</header>
	);
}
