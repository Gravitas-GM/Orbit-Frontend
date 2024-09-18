import {Menu, MenuDivider} from '@blueprintjs/core';
import * as React from 'react';
import {Permission} from '../../api/permissions';
import {Role} from '../../api/roles';
import {withPermissionRestriction} from '../Router/withPermissionRestriction';
import {withRoleRestriction} from '../Router/withRoleRestriction';
import {LinkedMenuItem} from './LinkedMenuItem';

export function SurveyMenu(): React.ReactElement {
	return (
		<Menu>
			{withRoleRestriction(Role.Admin, (
				<>
					<LinkedMenuItem to="/survey/bank" icon="projects" text="Survey Bank" />

					<MenuDivider />
				</>
			))}

			<LinkedMenuItem to="/survey" icon="third-party" text="Take This Week's Survey" />
			<LinkedMenuItem to="/survey/results" icon="grouped-bar-chart" text="Last Week's Results" />

			{withPermissionRestriction(Permission.Admin, (
				<>
					<MenuDivider />

					<LinkedMenuItem to="/survey/next" icon="th-derived" text="Edit Next Week's Survey" />
					<LinkedMenuItem to="/survey/history" icon="history" text="Previous Survey Results" />
					<LinkedMenuItem to="/survey/settings" icon="cog" text="Settings" />
				</>
			))}
		</Menu>
	);
}
