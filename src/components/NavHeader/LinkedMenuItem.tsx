import * as React from 'react';
import {Link, LinkProps} from 'react-router-dom';
import {MenuItem2 as MenuItem, MenuItem2Props as MenuItemProps} from '@blueprintjs/popover2';

interface Props {
	to: LinkProps['to'];
	text?: MenuItemProps['text'];
	icon?: MenuItemProps['icon'];
}

export const LinkedMenuItem: React.FC<Props> = ({to, text, icon}) => (
	<Link to={to} className="plain-link">
		<MenuItem
			text={text}
			icon={icon}
			tagName="span"
		/>
	</Link>
);