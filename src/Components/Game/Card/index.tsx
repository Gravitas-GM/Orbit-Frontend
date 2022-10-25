import React, {useState} from 'react';
import {Icon, IconName} from '@blueprintjs/core';
import './Card.scss';

interface IProps {
	title: string;
	icon: IconName;
	children: React.ReactNode;
	fill?: boolean;
}

export const GameCard: React.FC<IProps> = ({fill, title, icon, children}) => {
	const [open, setOpen] = useState(false);

	const onCollapse = (e: React.MouseEvent<HTMLDetailsElement, MouseEvent>) => {
		e.preventDefault();
		e.currentTarget.open = !e.currentTarget.open;
		setOpen(e.currentTarget.open);
	};

	return (
		<details className={`gm-card ${fill && open ? 'fill' : ''}`} onClick={e => onCollapse(e)}>
			<summary className={`gm-card-header ${!open ? 'gm-card-header__expand' : ''}`}>
				<Icon icon={icon} style={{marginRight: '0.5rem'}} />
				{title}
			</summary>

			<div className={`gm-card-content ${fill && open ? 'fill' : ''}`}>{children}</div>
		</details>
	);
};
