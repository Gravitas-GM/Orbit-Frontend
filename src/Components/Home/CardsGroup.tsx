import * as React from 'react';
import {H4} from '@blueprintjs/core';
import {Spacing} from '../../Styles/variables';
import './Home.scss';

interface IProps {
	children: React.ReactNode;
	title?: string;
}

export const CardsGroup: React.FC<IProps> = ({children, title}) => (
	<div className="cards-group">
		{title && <H4 style={{marginTop: Spacing.XLarge}}>{title}</H4>}

		<div className="cards-container">{children}</div>
	</div>
)
