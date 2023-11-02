import * as React from 'react';
import { Button } from '@blueprintjs/core';
import { QuizItem } from './Questions';

interface Props {
	questions: QuizItem[],
	show: boolean,
	dismiss: () => void
}

export const QuestionNavigator: React.FC<Props> = ({ questions, show, dismiss }) => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
	const [unansweredQuestions, setUnansweredQuestions] = React.useState<QuizItem[]>([]);

	React.useEffect(() => {
		const unanswered = questions.filter(item => item.answer === null);

		setUnansweredQuestions(unanswered);
	}, [questions, show, currentQuestionIndex]);

	const onNextClick = React.useCallback(() => {
		const unanswered = questions.filter(item => item.answer === null);

		setUnansweredQuestions(unanswered);

		if (unanswered.length === 0) {
			dismiss();

			return;
		}

		if (currentQuestionIndex + 1 >= unanswered.length)
			setCurrentQuestionIndex(0);
		else
			setCurrentQuestionIndex(currentQuestionIndex + 1);
	}, [questions, currentQuestionIndex])

	if (!show)
		return null;

	return (
		<div style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				padding: '2rem',
				position: 'fixed',
				bottom: 0,
				left: 0,
				width: '100%',
				height: '4rem',
				backgroundColor: 'black',
			}}

			className="question-navigator-container"
		>
			<span>{unansweredQuestions.length} questions unanswered.</span>

			<Button text="Next Question" onClick={onNextClick} />
		</div>
	);
};
