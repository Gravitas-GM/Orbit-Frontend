import {Button, Icon, IconSize, Intent} from '@blueprintjs/core';
import * as React from 'react';
import SimpleBar from 'simplebar-react';
import {Permission} from '../../../../api/permissions';
import {usePermissions} from '../../../../contexts/SessionContext';
import {classNames} from '../../../../utility/dom';
import './index.scss';

interface Props {
	children: React.ReactNode;
	processing: boolean;
	buttonLabel: string;
	onButtonClick: () => void;
	disabled: boolean;
}

export function Sidebar({processing, buttonLabel, onButtonClick, disabled, children}: Props): React.ReactElement {
	const isPermissionGranted = usePermissions();
	const isAdmin = isPermissionGranted(Permission.Admin);

	return (
		<aside className="gm-sidebar">
			<SimpleBar className={classNames('sidebar-simplebar', isAdmin && 'with-admin-controls')}>
				{children}
			</SimpleBar>

			{isAdmin && (
				<Button
					loading={processing}
					disabled={disabled}
					intent={Intent.PRIMARY}
					onClick={onButtonClick}
					large={true}
				>
					{buttonLabel} <Icon icon="caret-right" size={IconSize.STANDARD} />
				</Button>
			)}
		</aside>
	);
}

Sidebar.displayName = 'Sidebar';
