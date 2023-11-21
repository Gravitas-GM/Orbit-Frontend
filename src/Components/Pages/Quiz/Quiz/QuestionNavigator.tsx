import * as React from 'react';
import {Button, Intent} from '@blueprintjs/core';
import {QuizItem} from './Questions';
import './QuestionNavigator.scss';

interface Props {
	questions: QuizItem[];
	show: boolean;
	processing: boolean;
	onSubmit: () => Promise<void>;
}

export const QuestionNavigator: React.FC<Props> = ({questions, show, onSubmit, processing}) => {
	const hasUnanswered = React.useCallback(() => questions.filter(item => item.answer === null), [questions]);

	const focusChildInput = React.useCallback(() => {
		const unansweredQuestions = hasUnanswered();

		const question = document.getElementsByClassName(`question-${unansweredQuestions[0].prompt.id}`)[0];
		const input = question.getElementsByTagName('input')[0];

		if (question && input) {
			input.focus();

			question.scrollIntoView({behavior: 'smooth', block: 'center'});
		}
	}, [questions]);

	const onNextButtonClick = React.useCallback(() => {
		const unansweredQuestions = hasUnanswered();

		if (unansweredQuestions.length > 0)
			focusChildInput();
	}, [questions]);

	const onSubmitClick = React.useCallback(() => {
		const unansweredQuestions = hasUnanswered();

		if (unansweredQuestions.length > 0)
			onNextButtonClick();

		onSubmit();
	}, [questions]);

	React.useEffect(() => {
		onNextButtonClick();
	}, [questions, show]);

	if (!show)
		return null;

	return (
		<div className="question-navigator-container">
			<span>You have unanswered questions.</span>

			<div className="question-navigator-buttons">
				<Button text="Next Question" onClick={onNextButtonClick} intent={Intent.NONE} />

				<Button text="Submit" onClick={onSubmitClick} loading={processing} intent={Intent.PRIMARY} />
			</div>
		</div>
	);
};
