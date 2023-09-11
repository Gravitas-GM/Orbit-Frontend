import { H2 } from "@blueprintjs/core";
import { QuestionKind } from "../../../../Api/Quiz/Models/Questions";
import { QuestionResponse } from "../../../../Api/Quiz/Models/QuizSubmissions";
import { BooleanAnswer } from "../QuizAnswers/BooleanAnswer";
import { FreeTextAnswer } from "../QuizAnswers/FreeTextAnswer";
import { MultipleChoiceAnswer } from "../QuizAnswers/MultipleChoiceAnswer";
import "./QuizAnswers.scss";

interface IProps {
	questions: QuestionResponse[];
}

export const QuizAnswers: React.FC<IProps> = ({ questions }) => {
	return (
		<>
			<H2>Quiz Answers</H2>

			{questions.map((question) => (
				<Response question={question} key={question.prompt} />
			))}
		</>
	);
};

const Response: React.FC<{ question: QuestionResponse }> = ({ question }) => {
	switch (question.kind) {
		case QuestionKind.MultipleChoice:
			return <MultipleChoiceAnswer question={question} />;
		case QuestionKind.Boolean:
			return <BooleanAnswer question={question} />;
		case QuestionKind.FreeText:
			return <FreeTextAnswer question={question} />;
		default:
			return null;
	}
};