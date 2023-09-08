import * as React from 'react';
import { Icon } from "@blueprintjs/core";
import { MultipleChoiceResponse } from "../../../../Api/Quiz/Models/QuizSubmissions";
import { IconSize } from "../../../../IconSize";
import { QuestionResult } from "../QuestionResult";

export const MultipleChoiceAnswer: React.FC<{ question: MultipleChoiceResponse }> = ({ question }) => {
	return (
		<div className="question">
			<div className="question-title">
				<Icon icon="help" size={IconSize.SMALL} /> <span>{question.prompt}</span>
			</div>
			<div className="question-details">
				<div className="question-details-card">
					<span>Given Answer:</span>

					{question.choices[question.response]}
				</div>
				<div className="question-details-card">
					<span>Correct Answer:</span>

					{question.choices[question.answerIndex]}
				</div>

				<QuestionResult correct={question.correct}/>
			</div>
		</div>
	);
};
