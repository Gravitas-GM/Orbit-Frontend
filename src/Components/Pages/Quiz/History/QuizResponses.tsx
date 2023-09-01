import { QuestionKind } from "../../../../Api/Quiz/Models/Questions";
import {
	BooleanResponse,
	FreeTextResponse,
	MultipleChoiceResponse,
	QuestionResponse,
} from '../../../../Api/Quiz/Models/QuizSubmissions';
import { BooleanAnswer } from "../QuizAnswers/BooleanAnswer";
import { FreeTextAnswer } from "../QuizAnswers/FreeTextAnswer";
import { MultipleChoiceAnswer } from "../QuizAnswers/MultipleChoiceAnswer";
import "./QuizHistory.scss";
import SimpleBar from "simplebar-react";

interface IProps {
	questions: QuestionResponse[];
}

export const QuizResponses: React.FC<IProps> = ({ questions }) => {
	return (
		<SimpleBar className="questions-container">
			{questions.map((question) => (
				<Response question={question} key={question.prompt} />
			))}
		</SimpleBar>
	);
};

const Response: React.FC<{ question: QuestionResponse }> = ({ question }) => {
	switch (question.kind) {
		case QuestionKind.MultipleChoice:
			return <MultipleChoiceAnswer question={question as MultipleChoiceResponse} />;
		case QuestionKind.Boolean:
			return <BooleanAnswer question={question as BooleanResponse} />;
		case QuestionKind.FreeText:
			return <FreeTextAnswer question={question as FreeTextResponse} />;
		default:
			return null;
	}
};