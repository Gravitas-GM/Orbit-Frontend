import {
	Create,
	Entity,
	Id,
	Projectable,
	Projection,
	Queryable,
	QueryDocument,
	quizClient,
	Stub,
	Update,
} from '../../index';
import {QuestionTag} from './QuestionTags';
import {Settings} from './Settings';

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

interface QuestionBase extends Entity {
	account: Stub<Settings>,
	tag: Stub<QuestionTag> | null,
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

export type QuestionCreate = Create<FreeTextQuestion> | Create<BooleanQuestion> | Create<MultipleChoiceQuestion>;
export type QuestionUpdate = (Update<FreeTextQuestion> | Update<BooleanQuestion> | Update<MultipleChoiceQuestion>) & {
	kind: QuestionKind,
};

export class QuestionModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return quizClient.get('/questions', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: QuestionCreate, projection?: Projection) {
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
