import { H3 } from "@blueprintjs/core";
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
		<div className="quiz-answers-container">
			<H3>Quiz Answers</H3>

			{questions.map((question, index) => (
				<>
				<Response question={question} key={question.prompt} index={index} />
				<hr className="question-separator"/>
				</>
			))}

		</div>
	);
};

interface IResponseProps {
	question: QuestionResponse;
	index: number;
}


const Response: React.FC<IResponseProps> = ({question, index}) => {
	if (isMultipleChoiceResponse(question))
		return <MultipleChoiceAnswer question={question} index={index} />;

	if (isBooleanResponse(question))
		return <BooleanAnswer question={question} index={index} />;

	if (isFreeTextResponse(question))
		return <FreeTextAnswer question={question} index={index} />;

	throw new Error(`Unsupported question kind.`);
};
