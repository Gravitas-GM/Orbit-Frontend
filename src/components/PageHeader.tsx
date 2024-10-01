import {EntityTitle, H2, IconName, MaybeElement} from '@blueprintjs/core';
import {FC, ReactElement, ReactNode} from 'react';
import './PageHeader.scss';
import {useTitle} from '../hooks/useTitle';

interface Props {
	title?: string,
	children?: ReactNode,
	setPageTitle?: boolean,
	heading?: FC,
	icon?: IconName | MaybeElement,
	subtitle?: ReactElement | string,
}

export function PageHeader({
	title,
	children,
	icon,
	subtitle,
	heading = H2,
	setPageTitle = true,
}: Props): ReactElement {
	useTitle(setPageTitle ? title : undefined);

	return (
		<header className="header-container">
			{title && <EntityTitle title={title} heading={heading} icon={icon} subtitle={subtitle} />}
			{children}
		</header>
	);
}
