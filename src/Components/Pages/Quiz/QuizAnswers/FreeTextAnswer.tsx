import * as React from 'react';
import {Icon} from '@blueprintjs/core';
import {FreeTextResponse} from '../../../../Api/Quiz/Models/QuizSubmissions';
import {IconSize} from '../../../../IconSize';
import {QuestionResult} from '../QuestionResult';

export const FreeTextAnswer: React.FC<{ question: FreeTextResponse }> = ({question}) => {
	return (
		<div className="question">
			<div className="question-title">
				<Icon icon="help" size={IconSize.SMALL} /> <span>{question.prompt}</span>
			</div>

			<div className="question-details">
				<div className="question-details-card">
					<span>Given Answer:</span>

					{question.response}
				</div>

				<div className="question-details-card">
					<span>Correct Answers:</span>

					{question.answers.join(', ')}
				</div>

				<QuestionResult correct={question.correct} />
			</div>
		</div>
	);
};
