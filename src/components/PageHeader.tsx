import {H2} from '@blueprintjs/core';
import React from 'react';
import './PageHeader.scss';
import {useTitle} from '../hooks/useTitle';

interface IProps {
	title: string;
	children?: React.ReactNode;
}

export const PageHeader: React.FC<IProps> = ({title, children}) => {
	useTitle(title);

	return (
		<header className="header-container">
			<H2>{title}</H2>

			{children}
		</header>
	);
};
