import { H2 } from "@blueprintjs/core";
import "./QuizAnswers.scss";
import * as React from 'react';
import {QuestionKind} from '../../../../Api/Quiz/Models/Questions';
import {
	BooleanResponse,
	FreeTextResponse,
	MultipleChoiceResponse,
	QuestionResponse,
} from '../../../../Api/Quiz/Models/QuizSubmissions';
import {BooleanAnswer} from '../QuizAnswers/BooleanAnswer';
import {FreeTextAnswer} from '../QuizAnswers/FreeTextAnswer';
import {MultipleChoiceAnswer} from '../QuizAnswers/MultipleChoiceAnswer';
import './QuizAnswers.scss';

interface IProps {
	questions: QuestionResponse[];
}

function isMultipleChoiceResponse(value: any): value is MultipleChoiceResponse {
	return typeof value === 'object' && value.kind === QuestionKind.MultipleChoice;
}

function isBooleanResponse(value: any): value is BooleanResponse {
	return typeof value === 'object' && value.kind === QuestionKind.Boolean;
}

function isFreeTextResponse(value: any): value is FreeTextResponse {
	return typeof value === 'object' && value.kind === QuestionKind.FreeText;
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

const Response: React.FC<{ question: QuestionResponse }> = ({question}) => {
	if (isMultipleChoiceResponse(question))
		return <MultipleChoiceAnswer question={question} />;

	if (isBooleanResponse(question))
		return <BooleanAnswer question={question} />;

	if (isFreeTextResponse(question))
		return <FreeTextAnswer question={question} />;

	throw new Error(`Unsupported question kind.`);
};
