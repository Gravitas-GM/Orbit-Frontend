import React, { useState, useCallback } from 'react';
import { Icon, IconName } from '@blueprintjs/core';
import './GameCard.scss';
import { classNames } from '../../../../Utility/dom';
import { Classes } from '../../../../../classes';

interface IProps {
	title: string;
	icon: IconName;
	fill?: boolean;
	children?: React.ReactNode;
}

export const GameCard: React.FC<IProps> = ({ fill, title, icon, children }) => {
	const [open, setOpen] = useState(true);

	const onCollapseToggle = useCallback((e: React.MouseEvent<HTMLDetailsElement>) => {
		e.preventDefault();
		setOpen(open => !open);
	}, []);

	return (
		<details className={classNames(Classes.CARD, !open && 'collapsed', fill && 'fill')} open={open}>
			<summary className={Classes.CARD_HEADER} onClick={onCollapseToggle}>
				<Icon icon={icon} style={{ marginRight: '0.5rem' }} />
				{title}
			</summary>

			<div className={Classes.CARD_BODY}>{children}</div>
		</details>
	);
};
