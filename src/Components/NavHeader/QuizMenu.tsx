import * as React from 'react';
import {Menu, MenuDivider} from '@blueprintjs/core';
import {LinkedMenuItem} from './LinkedMenuItem';
import {Permission, PermissionContext} from '../../Permission';

export const QuizMenu: React.FC = () => {
	const [isGranted] = React.useContext(PermissionContext);

	return (
		<Menu>
			<LinkedMenuItem to="/quiz" icon="predictive-analysis" text="Take A Quiz" />
			<LinkedMenuItem to="/quiz/history" icon="history" text="Quiz History" />

			{isGranted(Permission.ADMIN) && (
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