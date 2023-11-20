import * as React from 'react';
import {Button, Icon, IconSize, Intent} from '@blueprintjs/core';
import {useContext} from 'react';
import SimpleBar from 'simplebar-react';
import {Permission, PermissionContext} from '../../../../Permission';
import {classNames} from '../../../Utility/dom';
import './Sidebar.scss';

interface IProps {
	children: React.ReactNode;
	processing: boolean;
	buttonLabel: string;
	onButtonClick: () => void;
	disabled: boolean;
}

export const Sidebar: React.FC<IProps> = props => {
	const [isGranted] = useContext(PermissionContext);
	const isAdmin = isGranted(Permission.ADMIN);

	return (
		<aside className="gm-sidebar">
			<SimpleBar className={classNames('sidebar-simplebar', isAdmin && 'with-admin-controls')}>
				{props.children}
			</SimpleBar>

			{isAdmin && (
				<Button
					loading={props.processing}
					disabled={props.disabled}
					intent={Intent.PRIMARY}
					onClick={props.onButtonClick}
					large
				>
					{props.buttonLabel} <Icon icon="caret-right" size={IconSize.STANDARD} />
				</Button>
			)}
		</aside>
	);
}

Sidebar.displayName = 'Sidebar';
