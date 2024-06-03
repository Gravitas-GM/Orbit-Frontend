import React from 'react';
import {H2} from '@blueprintjs/core';
import {useEffect} from 'react';
import './PageHeader.scss';

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

export function useTitle(title: string, skipPrefix = false) {
	const titleValue = React.useMemo(() => {
		return (skipPrefix ? '' : 'Happy Orbit | ') + title;
	}, [title, skipPrefix]);

	useEffect(() => {
		document.title = titleValue;
	}, [titleValue]);
}
