import { Icon, InputGroup } from "@blueprintjs/core";
import { FreeTextResponse } from "../../../../Api/Quiz/Models/QuizSubmissions";
import { IconSize } from "../../../../IconSize";
import { QuestionResult } from "../QuestionResult";
import { Spacing } from "../../../../Styles/variables";

export const FreeTextAnswer: React.FC<{ question: FreeTextResponse }> = ({ question }) => {
console.log(question, "question"	)

	return (
		<div className="question">
			<div className="question-title">
				<Icon icon="help" size={IconSize.SMALL} /> <span>{question.prompt}</span>
			</div>

			<div className="question-details">
				{question.answers.map((answer) => (
					<QuestionResult key={answer} correct={question.correct} selected={question.response === answer}>
						<InputGroup disabled defaultValue={answer} style={{margin: Spacing.Small}} />
					</QuestionResult>
				))}
			</div>
		</div>
	);
};
