import {Id, Projectable, Projection, Queryable, QueryDocument, quizClient} from '../../index';
import {Account} from './Accounts';
import {Question} from './Questions';
import {User} from './Users';

export interface QuestionTagEndpoints {
	'/tags': {
		GET: {
			query: Queryable & Projectable;
			response: QuestionTag[];
		};

		PUT: {
			query: Projectable;
			body: QuestionTagCreatePayload;
			response: QuestionTag;
		};
	};

	'/tags/:tag': {
		GET: {
			params: Id;
			response: QuestionTag;
		};

		PATCH: {
			params: Id;
			body: QuestionTagUpdatePayload;
			response: QuestionTag;
		};

		DELETE: {
			params: Id;
			response: void;
		};
	};
}

export interface QuestionTag {
	id: Id,
	account: Pick<Account, 'id'>,
	label: string,
	members: User[],
	questions: Question[],
}

export type QuestionTagCreatePayload = Omit<QuestionTag, 'id' | 'account'>;

export type QuestionTagUpdatePayload = Partial<Omit<QuestionTag, 'id' | 'account'>>;

export class QuestionTagModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return quizClient.get('/tags', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: QuestionTagCreatePayload, projection?: Projection) {
		return quizClient.put('/tags', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(questionTag: Id, projection?: Projection) {
		return quizClient.get<'/tags/:tag'>(`/tags/${questionTag}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(questionTag: Id, payload: QuestionTagUpdatePayload, projection?: Projection) {
		return quizClient.patch<'/tags/:tag'>(`/tags/${questionTag}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(questionTag: Id) {
		return quizClient.delete<'/tags/:tag'>(`/tags/${questionTag}`);
	}
}
