import {Id, Projectable, Projection, Queryable, QueryDocument, quizClient} from '../../index';
import {BooleanQuestion, FreeTextQuestion, MultipleChoiceQuestion} from './Questions';
import {User} from './Users';

export interface QuizSubmissionEndpoints {
	'/submissions': {
		GET: {
			query: Queryable & Projectable;
			response: QuizSubmission[];
		};
	};

	'/submissions/:submission': {
		GET: {
			params: Id;
			response: QuizSubmission;
		};
	};
}

export interface QuizSubmission {
	id: number,
	userId: User,
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

export type QuizSubmissionCreatePayload = Omit<QuizSubmission, 'id'>;

export class QuizSubmissionModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return quizClient.get('/submissions', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static read(submission: Id) {
		return quizClient.get<'/submissions/:submission'>(`/submissions/${submission}`);
	}
}
