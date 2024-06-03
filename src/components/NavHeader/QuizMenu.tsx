import {Menu, MenuDivider} from '@blueprintjs/core';
import * as React from 'react';
import {Permission} from '../../api/permissions';
import {usePermissions} from '../../contexts/SessionContext';
import {LinkedMenuItem} from './LinkedMenuItem';

export const QuizMenu: React.FC = () => {
	const isPermissionGranted = usePermissions();

	return (
		<Menu>
			<LinkedMenuItem to="/quiz" icon="predictive-analysis" text="Take A Quiz" />
			<LinkedMenuItem to="/quiz/history" icon="history" text="Quiz History" />

			{isPermissionGranted(Permission.Admin) && (
				<>
					<MenuDivider />

					<LinkedMenuItem to="/quiz/questions" icon="clipboard" text="Questions" />
					<LinkedMenuItem to="/quiz/tags" icon="tag" text="Question Tags" />
					<LinkedMenuItem to="/quiz/settings" icon="cog" text="Settings" />
				</>
			)}
		</Menu>
	);
};

QuizMenu.displayName = 'QuizMenu';
