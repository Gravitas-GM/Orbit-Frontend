import {User} from './Users';

export interface QuestionEndpoints {
	// TODO: Add endpoints
}

interface BaseQuestion {
	id: number,
	tagId: number|null,
	prompt: string,
	kind: QuestionKind,
}

export enum QuestionKind {
	FreeText = 'free text',
	Boolean = 'boolean',
	MultipleChoice = 'multiple choice',
}

export interface FreeTextQuestion extends BaseQuestion {
	kind: QuestionKind.FreeText,
	answers: string[],
}

export interface BooleanQuestion extends BaseQuestion {
	kind: QuestionKind.Boolean,
	answer: boolean,
	trueLabel: string|null,
	falseLabel: string|null,
}

export interface MultipleChoiceQuestion extends BaseQuestion {
	kind: QuestionKind.MultipleChoice,
	choices: string[],
	answerIndex: number,
}

export type Question = FreeTextQuestion | BooleanQuestion | MultipleChoiceQuestion;
