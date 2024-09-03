import {EntityTitle, H2, IconName, MaybeElement} from '@blueprintjs/core';
import {FC, ReactElement, ReactNode} from 'react';
import './PageHeader.scss';
import {useTitle} from '../hooks/useTitle';

interface IProps {
	title?: string,
	children?: ReactNode,
	setPageTitle?: boolean,
	heading?: FC,
	icon?: IconName | MaybeElement,
	subtitle?: ReactNode,
}

export function PageHeader({
	title,
	children,
	icon,
	subtitle,
	heading = H2,
	setPageTitle = true,
}: IProps): ReactElement {
	useTitle(setPageTitle ? title : undefined);

	return (
		<header className="header-container">
			{title && <EntityTitle title={title} heading={heading} icon={icon} subtitle={subtitle} />}
			{children}
		</header>
	);
}
