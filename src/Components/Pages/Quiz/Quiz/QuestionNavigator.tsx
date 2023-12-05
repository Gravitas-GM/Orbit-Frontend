import * as React from 'react';
import {Button, Intent} from '@blueprintjs/core';
import {QuizItem} from './Questions';
import './QuestionNavigator.scss';
import { on } from 'events';

interface Props {
	questions: QuizItem[];
	show: boolean;
	processing: boolean;
	onSubmit: () => Promise<void>;
}

export const QuestionNavigator: React.FC<Props> = ({questions, show, onSubmit, processing}) => {
	const getNextUnansweredQuestion = React.useCallback(() => questions.find(item => item.answer === null), [questions]);

	const focusChildInput = React.useCallback(() => {
		const nextUnansweredQuestion = getNextUnansweredQuestion();

		if (!nextUnansweredQuestion)
			return;

		const question = document.getElementsByClassName(`question-${nextUnansweredQuestion.prompt.id}`)[0];
		const input = question.getElementsByTagName('input')[0];

		if (question && input) {
			input.focus();

			question.scrollIntoView({behavior: 'smooth', block: 'center'});
		}
	}, [questions]);

	const onNextButtonClick = React.useCallback(() => {
		const nextUnansweredQuestion = getNextUnansweredQuestion();

		if (nextUnansweredQuestion)
			focusChildInput();
	}, [questions]);

	const onSubmitClick = React.useCallback(() => {
		const nextUnansweredQuestion = getNextUnansweredQuestion();

		if (nextUnansweredQuestion)
			onNextButtonClick();

		onSubmit();
	}, [questions]);

	React.useEffect(() => {
		onNextButtonClick();
	}, [onNextButtonClick]);

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
