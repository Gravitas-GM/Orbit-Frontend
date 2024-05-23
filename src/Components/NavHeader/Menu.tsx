import * as React from 'react';
import {IconName, Menu as BaseMenu} from '@blueprintjs/core';
import {MatchQuery, PermissionContext} from '../../Permission';
import {Role, RoleContext} from '../../Role';
import {LinkedMenuItem} from './LinkedMenuItem';

interface MenuItem {
	icon: IconName,
	text: string,
	uri: string,
	key?: React.Key,
	permissions?: MatchQuery,
	role?: Role,
}

function isMenuItem(value: any): value is MenuItem {
	return typeof value === 'object' && 'icon' in value;
}

interface Props {
	items: Array<MenuItem|React.ReactNode>,
}

export function Menu({items}: Props): React.ReactElement {
	const [isGranted] = React.useContext(PermissionContext);
	const [isRoleGranted] = React.useContext(RoleContext);

	const elements: React.ReactNode[] = new Array(items.length);

	for (const item of items) {
		if (!isMenuItem(item)) {
			elements.push(item);
			continue;
		}

		if (typeof item.permissions !== 'undefined' && !isGranted(item.permissions))
			continue;

		if (typeof item.role !== 'undefined' && !isRoleGranted(item.role))
			continue;

		elements.push((
			<LinkedMenuItem key={item.key ?? item.text} to={item.uri} icon={item.icon} text={item.text} />
		));
	}

	return (
		<BaseMenu>
			{elements}
		</BaseMenu>
	);
}
