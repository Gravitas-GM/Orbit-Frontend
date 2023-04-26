import {BooleanQuestion, FreeTextQuestion, MultipleChoiceQuestion} from './Questions';
import {User} from './Users';

export interface QuizSubmissionEndpoints {
	// TODO: Add endpoints
}

export interface QuizSubmission {
	id: number,
	user: User,
	timestamp: Date,
	correctCount: number,
	questions: QuestionResponse[],
}

class BaseQuestion {
}

interface BaseQuestionResponse extends Omit<BaseQuestion, 'tagId' | 'kind'> {
	correct: boolean,
}

export interface FreeTextResponse extends BaseQuestionResponse, Omit<FreeTextQuestion, 'tagId'> {
	response: string,
}

export interface BooleanResponse extends BaseQuestionResponse, Omit<BooleanQuestion, 'tagId'> {
	response: boolean,
}

export interface MultipleChoiceResponse extends BaseQuestionResponse, Omit<MultipleChoiceQuestion, 'tagId'> {
	response: number,
}

export type QuestionResponse = FreeTextResponse | BooleanResponse | MultipleChoiceResponse;
