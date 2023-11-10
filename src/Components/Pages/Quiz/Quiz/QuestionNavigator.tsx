import * as React from 'react';
import {Button, Intent} from '@blueprintjs/core';
import {QuizItem} from './Questions';
import './QuestionNavigator.scss';

interface Props {
	questions: QuizItem[];
	show: boolean;
	submitting: boolean;
	onSubmit: () => Promise<void>;
}

export const QuestionNavigator: React.FC<Props> = ({questions, show, onSubmit, submitting}) => {
	React.useEffect(() => {
		const unanswered = questions.filter(item => item.answer === null);

		unanswered.length > 0 && goToNextQuestion();
	}, [questions, show]);

	const onSubmitClick = React.useCallback(() => {
		const unanswered = questions.filter(item => item.answer === null);

		if (unanswered.length === 0) {
			onSubmit();

			return;
		}

		goToNextQuestion();

		onSubmit();
	}, [questions]);

	const focusChildInput = React.useCallback((rootElement: Element) => {
		const input = rootElement.getElementsByTagName('input')[0];

		if (input) {
			input.focus();
		}
	}, []);

	const goToNextQuestion = React.useCallback(() => {
		const unanswered = questions.filter(item => item.answer === null);

		const question = document.getElementsByClassName(`question-${unanswered[0].prompt.id}`)[0];

		if (question) {
			question.scrollIntoView({behavior: 'smooth', block: 'center'});

			focusChildInput(question);
		}
	}, [questions]);

	if (!show)
		return null;

	return (
		<div className="question-navigator-container">
			<span>You have unanswered questions.</span>

			<Button text="Submit" onClick={onSubmitClick} loading={submitting} intent={Intent.PRIMARY} />
		</div>
	);
};
