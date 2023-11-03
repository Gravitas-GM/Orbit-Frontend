import * as React from 'react';
import {Button} from '@blueprintjs/core';
import {QuizItem} from './Questions';
import './QuestionNavigator.scss';

interface Props {
	questions: QuizItem[];
	show: boolean;
	dismiss: () => void;
}

export const QuestionNavigator: React.FC<Props> = ({questions, show, dismiss}) => {
	const [unansweredQuestions, setUnansweredQuestions] = React.useState<QuizItem[]>([]);

	React.useEffect(() => {
		const unanswered = questions.filter(item => item.answer === null);

		setUnansweredQuestions(unanswered);

		unansweredQuestions.length > 0 && highlightUnaswered();
	}, [questions, show]);

	const onNextClick = React.useCallback(() => {
		const unanswered = questions.filter(item => item.answer === null);

		setUnansweredQuestions(unanswered);

		if (unanswered.length === 0) {
			dismiss();

			return;
		}

		highlightUnaswered();
	}, [questions, unansweredQuestions]);

	const highlightUnaswered = React.useCallback(() => {
		const unanswered = questions.filter(item => item.answer === null);

		const question = document.getElementsByClassName(`question-${unanswered[0].prompt.id}`)[0];

		if (question) {
			question.scrollIntoView({behavior: 'smooth', block: 'center'});

			question.classList.add('highlight');

			setTimeout(() => {
				question.classList.remove('highlight');
			}, 500);
		}
	}, [questions, unansweredQuestions]);

	if (!show)
		return null;

	return (
		<div className="question-navigator-container" key={unansweredQuestions.length}>
			<span>
				You have {unansweredQuestions.length} unanswered question{unansweredQuestions.length > 1 ? 's' : ''}.
			</span>

			<Button text="Next Question" onClick={onNextClick} />
		</div>
	);
};
