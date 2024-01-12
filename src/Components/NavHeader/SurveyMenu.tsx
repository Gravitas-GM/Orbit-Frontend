import * as React from 'react';
import {Menu, MenuDivider} from '@blueprintjs/core';
import {LinkedMenuItem} from './LinkedMenuItem';
import {Permission, PermissionContext} from '../../Permission';
import {Role, RoleContext} from '../../Role';

export const SurveyMenu: React.FC = () => {
	const [isGranted] = React.useContext(PermissionContext);
	const [hasRole] = React.useContext(RoleContext);

	return (
		<Menu>
			<LinkedMenuItem to="/survey" icon="third-party" text="Take the Survey" />
			<LinkedMenuItem to="/survey/results" icon="grouped-bar-chart" text="Survey Results" />

			{isGranted(Permission.ADMIN) && (
				<>
					<MenuDivider />

					{hasRole(Role.ADMIN) && <LinkedMenuItem to="/survey/bank" icon="projects" text="Bank" />}

					<LinkedMenuItem to="/survey/next" icon="th-derived" text="Next Survey" />
					<LinkedMenuItem to="/survey/history" icon="history" text="History" />
					<LinkedMenuItem to="/survey/settings" icon="cog" text="Settings" />
				</>
			)}
		</Menu>
	);
};

SurveyMenu.displayName = 'SurveyMenu';
