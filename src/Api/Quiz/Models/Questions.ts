import {Id, Projectable, Projection, Queryable, QueryDocument, quizClient} from '../../index';

export interface QuestionEndpoints {
	'/questions': {
		GET: {
			query: Queryable & Projectable;
			response: Question[];
		};

		PUT: {
			query: Projectable;
			body: QuestionCreatePayload;
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
			body: QuestionUpdatePayload;
			response: Question;
		};

		DELETE: {
			params: Id;
			response: void;
		};
	};
}

interface BaseQuestion {
	id: number,
	accountId: number,
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

export type QuestionCreatePayload = Omit<Question, 'id'>;

export type QuestionUpdatePayload = Partial<Omit<Question, 'id' | 'accountId'>>;

export class QuestionModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return quizClient.get('/questions', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: QuestionCreatePayload, projection?: Projection) {
		return quizClient.put('/questions', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(question: Id) {
		return quizClient.get<'/questions/:question'>(`/questions/${question}`);
	}

	public static update(question: Id, payload: QuestionUpdatePayload) {
		return quizClient.patch<'/questions/:question'>(`/questions/${question}`, payload);
	}

	public static delete(question: Id) {
		return quizClient.delete<'/questions/:question'>(`/questions/${question}`);
	}
}
