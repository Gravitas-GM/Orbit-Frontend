import React from 'react';
import {ApiError} from '../../api/errors/symfony';
import {GamesModel} from '../../api/Game-State/Models/Games';
import {QuizModel} from '../../api/Quiz/Models/Quiz';
import {Classes} from '../../classes';
import {PageHeader} from '../../components/PageHeader';
import {useAppUser} from '../../contexts/SessionContext';
import {toaster} from '../../toaster';
import {DebugButton} from './DebugButton';

export const DebugControls: React.FC = () => {
	const user = useAppUser();

	const onStopGameClick = React.useCallback(async () => {
		if (!user)
			return;

		try {
			await GamesModel.deleteGameState(user.account.id);
		} catch {
			toaster.error('There was an error while trying to cancel the current game.');
			return;
		}

		toaster.success('Current Game has been stopped');
	}, [user]);

	const onResetQuizClick = React.useCallback(async () => {
		if (!user)
			return;

		try {
			await QuizModel.reset(user.id);
		} catch (error) {
			if (error instanceof ApiError)
				toaster.error('Could not reset active quiz: ' + error.message);
			else
				toaster.showUnhandledErrorMessage();

			return;
		}

		toaster.success('Active quiz has been reset.');
	}, [user]);

	return (
		<div className={Classes.PAGE_WRAPPER}>
			<PageHeader title="Debug" />

			<DebugButton onClick={onStopGameClick} text="Stop Current Game" />
			<DebugButton onClick={onResetQuizClick} text="Reset Active Quiz" />
		</div>
	);
};
