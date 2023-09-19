import * as React from 'react';
import {Icon} from '@blueprintjs/core';
import {BooleanResponse} from '../../../../Api/Quiz/Models/QuizSubmissions';
import {IconSize} from '../../../../IconSize';
import {QuestionResult} from '../QuestionResult';

export const BooleanAnswer: React.FC<{ question: BooleanResponse }> = ({question}) => {
	return (
		<div className="question">
			<div className="question-title">
				<Icon icon="help" size={IconSize.SMALL} /> <span>{question.prompt}</span>
			</div>

			<div className="question-details">
				<div className="question-details-card">
					<span>Given Answer: </span>

					{question.response ? question.trueLabel : question.falseLabel}
				</div>

				<div className="question-details-card">
					<span>Correct Answer: </span>

					{question.answer ? question.trueLabel : question.falseLabel}
				</div>

				<QuestionResult correct={question.correct} />
			</div>
		</div>
	);
};
