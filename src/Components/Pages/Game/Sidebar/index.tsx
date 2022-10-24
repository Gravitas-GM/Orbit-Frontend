import {Button, Icon, IconSize, Intent} from '@blueprintjs/core';
import './Sidebar.scss';

interface IProps {
	children: React.ReactNode;
}

export const Sidebar: React.FC<IProps> = props => (
	<aside className="gm-sidebar">
		<div>{props.children}</div>

		<Button intent={Intent.PRIMARY} large>
			Start <Icon icon="caret-right" size={IconSize.STANDARD} />
		</Button>
	</aside>
);
