import React, {useState, useCallback} from 'react';
import {Icon, IconName} from '@blueprintjs/core';
import './Card.scss';

interface IProps {
	title: string;
	icon: IconName;
	children: React.ReactNode;
	fill?: boolean;
}

export const GameCard: React.FC<IProps> = ({fill, title, icon, children}) => {
	const [open, setOpen] = useState(true);

	const onCollapse = useCallback(() => {
		setOpen(currentOpen => !currentOpen);
	}, []);

	return (
		<details className={`gm-card ${fill && open ? 'fill' : ''}`} onClick={e => e.preventDefault()} open={open}>
			<summary
			className={`gm-card-header ${!open ? 'collapsed' : ''}`}
			onClick={() => onCollapse()}
			>
				<Icon icon={icon} style={{marginRight: '0.5rem'}} />
				{title}
			</summary>

			<div className="gm-card-content">{children}</div>
		</details>
	);
};
