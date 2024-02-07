import {Button, H3} from '@blueprintjs/core';
import * as React from 'react';
import {Redirect} from 'react-router';
import {ApiError} from '../../../../Api/errors/symfony';
import {Quiz, QuizModel} from '../../../../Api/Quiz/Models/Quiz';
import {SettingsModel} from '../../../../Api/Quiz/Models/Settings';
import {Classes} from '../../../../classes';
import {UserContext} from '../../../../Session';
import {toaster} from '../../../../toaster';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {QuizPage} from './index';

export function Interstitial(): React.ReactElement {
	const [loading, setLoading] = React.useState(true);
	const [redirect, setRedirect] = React.useState<string | null>(null);

	const [quiz, setQuiz] = React.useState<Quiz | null>(null);

	const [questionCount, setQuestionCount] = React.useState(0);
	const [timeLimitSeconds, setTimeLimitSeconds] = React.useState<number | null>(null);

	const {account} = React.useContext(UserContext) ?? {};

	React.useEffect(() => {
		QuizModel.getActive()
			.then(r => setQuiz(r.data))
			.catch(async e => {
				// A 404 error indicates that the user doesn't have an active quiz, so we should proceed with loading
				// account settings to display the interstitial.
				if (!(e instanceof ApiError) || !e.isNotFound()) {
					toaster.showUnhandledErrorMessage();
					setRedirect('/');
				}

				const settings = await SettingsModel.read(account!.id).then(r => r.data);

				setQuestionCount(settings.questionCount);
				setTimeLimitSeconds(settings.quizDurationSeconds);
			})
			.finally(() => setLoading(false));
	}, []);

	const onCancelClick = React.useCallback(() => {
		history.back();
	}, []);

	const onStartClick = React.useCallback(async () => {
		const quiz = await QuizModel.start().then(r => r.data);
		setQuiz(quiz);
	}, []);

	if (loading)
		return <FrameLoadingSpinner />;
	else if (redirect)
		return <Redirect to={redirect} />;

	if (quiz !== null)
		return <QuizPage quiz={quiz} />;

	return (
		<div className={Classes.PAGE_WRAPPER}>
			<H3>Are you ready to start your quiz?</H3>

			<p>
				Your quiz will have {questionCount} questions.
			</p>

			{timeLimitSeconds !== null ? (
				<p>
					You will have {Math.floor(timeLimitSeconds / 60)} minutes to complete your quiz.
				</p>
			) : (
				<p>
					There is no limit to how long you have to take the quiz.
				</p>
			)}

			<div
				style={{
					display: 'flex',
					gap: 10,
				}}
			>
				<Button text="Cancel" onClick={onCancelClick} />
				<Button intent="primary" text="I'm Ready!" onClick={onStartClick} />
			</div>
		</div>
	);
}
