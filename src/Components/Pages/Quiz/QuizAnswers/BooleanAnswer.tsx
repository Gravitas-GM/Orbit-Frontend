import * as React from 'react';
import { Icon, Radio } from "@blueprintjs/core";
import { BooleanResponse } from "../../../../Api/Quiz/Models/QuizSubmissions";
import { IconSize } from "../../../../IconSize";
import { QuestionResult } from "../QuestionResult";

export const BooleanAnswer: React.FC<{ question: BooleanResponse }> = ({question}) => {
	return (
		<div className="question">
			<div className="question-title">
				<Icon icon="help" size={IconSize.SMALL} /> <span>{question.prompt}</span>
			</div>

			<div className="question-details">
				<QuestionResult
					correct={question.response === question.correct}
					selected={question.response === true}
				>
					<p>{question.trueLabel}</p>

					<Radio defaultChecked={question.response === true} />
				</QuestionResult>

				<QuestionResult
					correct={question.response !== question.correct}
					selected={question.response === false}
				>
					<p>{question.falseLabel}</p>

					<Radio defaultChecked={question.response === false} />
				</QuestionResult>
			</div>
		</div>
	);
};
