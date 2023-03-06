import * as React from 'react';
import {Button, Icon, IconSize, Intent} from '@blueprintjs/core';
import './Sidebar.scss';

interface IProps {
	children: React.ReactNode;
	processing: boolean;
	isNextButton: boolean;
	onStartClick: () => void;
	onNextClick: () => void;
}

export const Sidebar: React.FC<IProps> = props => (
	<aside className="gm-sidebar">
		<div>{props.children}</div>

		<Button
			intent={Intent.PRIMARY}
			onClick={props.isNextButton ? props.onNextClick : props.onStartClick}
			large
		>
			{props.isNextButton ? 'Next' : 'Start'} <Icon icon="caret-right" size={IconSize.STANDARD} />
		</Button>
	</aside>
);

Sidebar.displayName = 'Sidebar';
