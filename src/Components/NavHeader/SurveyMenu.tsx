import {Menu, MenuDivider} from '@blueprintjs/core';
import * as React from 'react';
import {Permission, PermissionContext} from '../../Permission';
import {Role, RoleContext} from '../../Role';
import {LinkedMenuItem} from './LinkedMenuItem';

export function SurveyMenu(): React.ReactElement {
	const [isGranted] = React.useContext(PermissionContext);
	const [isRoleGranted] = React.useContext(RoleContext);

	return (
		<Menu>
			{isRoleGranted(Role.ADMIN) && (
				<>
					<LinkedMenuItem to="/survey-bank" icon="projects" text="Survey Bank" />

					<MenuDivider />
				</>
			)}

			<LinkedMenuItem to="/survey" icon="third-party" text="Take This Week's Survey" />
			<LinkedMenuItem to="/results" icon="grouped-bar-chart" text="Last Week's Results" />

			{isGranted(Permission.ADMIN) && (
				<>
					<MenuDivider />

					<LinkedMenuItem to="/survey/next" icon="th-derived" text="Edit Next Week's Survey" />
					<LinkedMenuItem to="/survey/history" icon="history" text="Previous Survey Results" />
					<LinkedMenuItem to="/survey/settings" icon="cog" text="Settings" />
				</>
			)}
		</Menu>
	);
}
