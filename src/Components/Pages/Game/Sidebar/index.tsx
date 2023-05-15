import * as React from 'react';
import {Button, Icon, IconSize, Intent} from '@blueprintjs/core';
import './Sidebar.scss';
import SimpleBar from 'simplebar-react';

interface IProps {
	children: React.ReactNode;
	processing: boolean;
	buttonLabel: string;
	onButtonClick: () => void;
}

export const Sidebar: React.FC<IProps> = props => (
	<aside className="gm-sidebar">
		<SimpleBar style={{maxHeight: 'calc(100vh - 150px)'}}>
			<div>{props.children}</div>
		</SimpleBar>

		<Button
			intent={Intent.PRIMARY}
			onClick={props.onButtonClick}
			large
		>
			{props.buttonLabel} <Icon icon="caret-right" size={IconSize.STANDARD} />
		</Button>
	</aside>
);

Sidebar.displayName = 'Sidebar';
