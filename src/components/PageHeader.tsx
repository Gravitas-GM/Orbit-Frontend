import {H2} from '@blueprintjs/core';
import React from 'react';
import './PageHeader.scss';
import {useTitle} from '../hooks/useTitle';

interface IProps {
	title?: string,
	children?: React.ReactNode,
	setPageTitle?: boolean,
}

export function PageHeader({title, children, setPageTitle = true}: IProps): React.ReactElement {
	useTitle(setPageTitle ? title : undefined);

	return (
		<header className="header-container">
			{title && <H2>{title}</H2>}
			{children}
		</header>
	);
}
