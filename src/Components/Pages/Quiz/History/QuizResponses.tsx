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

function isMultipleChoiceResponse(value: any): value is MultipleChoiceResponse {
	return typeof value === 'object' && (value.kind ?? null) === QuestionKind.MultipleChoice;
}

function isBooleanResponse(value: any): value is BooleanResponse {
	return typeof value === 'object' && (value.kind ?? null) === QuestionKind.Boolean;
}

function isFreeTextResponse(value: any): value is FreeTextResponse {
	return typeof value === 'object' && (value.kind ?? null) === QuestionKind.FreeText;
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
	if (isMultipleChoiceResponse(question))
		return <MultipleChoiceAnswer question={question} />;

	if (isBooleanResponse(question))
		return <BooleanAnswer question={question} />;

	if (isFreeTextResponse(question))
		return <FreeTextAnswer question={question} />;

	return null;
};
