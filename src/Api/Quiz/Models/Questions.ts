import {Id, Projectable, Projection, Queryable, QueryDocument, quizClient} from '../../index';
import {Account} from './Accounts';
import {QuestionTag} from './QuestionTags';

export interface QuestionEndpoints {
	'/questions': {
		GET: {
			query: Queryable & Projectable;
			response: Question[];
		};

		PUT: {
			query: Projectable;
			body: QuestionUpdate;
			response: Question;
		};
	};

	'/questions/:question': {
		GET: {
			params: Id;
			response: Question;
		};

		PATCH: {
			params: Id;
			body: QuestionUpdate;
			response: Question;
		};

		DELETE: {
			params: Id;
			response: void;
		};
	};
}

interface QuestionBase {
	id: number,
	account: Pick<Account, 'id'>,
	tag: Pick<QuestionTag, 'id'> | null,
	prompt: string,
	kind: QuestionKind,
}

export enum QuestionKind {
	FreeText = 'free text',
	Boolean = 'boolean',
	MultipleChoice = 'multiple choice',
}

export interface FreeTextQuestion extends QuestionBase {
	kind: QuestionKind.FreeText,
	answers: string[],
}

export interface BooleanQuestion extends QuestionBase {
	kind: QuestionKind.Boolean,
	answer: boolean,
	trueLabel: string | null,
	falseLabel: string | null,
}

export interface MultipleChoiceQuestion extends QuestionBase {
	kind: QuestionKind.MultipleChoice,
	choices: string[],
	answerIndex: number,
}

export type Question = FreeTextQuestion | BooleanQuestion | MultipleChoiceQuestion;

interface QuestionUpdateBase {
	tag: number,
	prompt: string,
	kind: QuestionKind,
}

export interface FreeTextQuestionUpdate extends QuestionUpdateBase {
	kind: QuestionKind.FreeText,
	answers: string[],
}

export interface BooleanQuestionUpdate extends QuestionUpdateBase {
	kind: QuestionKind.Boolean,
	answer: boolean,
	trueLabel: string | null,
	falseLabel: string | null,
}

export interface MultipleChoiceQuestionUpdate extends QuestionUpdateBase {
	kind: QuestionKind.MultipleChoice,
	choices: string[],
	answerIndex: number,
}

export type QuestionUpdate = FreeTextQuestionUpdate | BooleanQuestionUpdate | MultipleChoiceQuestionUpdate;

export class QuestionModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return quizClient.get('/questions', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: QuestionUpdate, projection?: Projection) {
		return quizClient.put('/questions', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(question: Id, projection?: Projection) {
		return quizClient.get<'/questions/:question'>(`/questions/${question}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(question: Id, payload: QuestionUpdate, projection?: Projection) {
		return quizClient.patch<'/questions/:question'>(`/questions/${question}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(question: Id) {
		return quizClient.delete<'/questions/:question'>(`/questions/${question}`);
	}
}
