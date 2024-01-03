import {Id, Projectable, Projection, Queryable, QueryDocument, surveyClient} from '../../index';
import {Survey, SurveyQuestionKind} from './Survey';

export interface SurveyBankEndpoints {
	'/survey-bank': {
		GET: {
			query: Projectable & Queryable;
			response: BankSurvey[];
		};

		PUT: {
			query: Projectable;
			body: BankSurveyUpdatePayload;
			response: BankSurvey;
		};
	};

	'/survey-bank/:bankSurvey': {
		GET: {
			query: Projectable;
			response: BankSurvey;
		};

		PATCH: {
			query: Projectable;
			params: Id;
			body: BankSurveyUpdatePayload;
			response: BankSurvey;
		}

		DELETE: {
			params: Id;
			response: void;
		}
	}
}

interface BankQuestionBase {
	id: Id,
	survey: Pick<Survey, 'id'>,
	kind: SurveyQuestionKind,
	prompt: string,
}

export interface BankFreeTextQuestion extends BankQuestionBase {
	kind: SurveyQuestionKind.FreeText,
}

export interface BankScaleQuestion extends BankQuestionBase {
	kind: SurveyQuestionKind.Scale,
	minValue: number,
	maxValue: number,
}

export interface BankMultipleChoiceQuestion extends BankQuestionBase {
	kind: SurveyQuestionKind.MultipleChoice,
	choices: string[],
}

export type BankQuestion = BankFreeTextQuestion | BankScaleQuestion | BankMultipleChoiceQuestion;

export interface BankSurvey {
	id: Id,
	sort: number,
	protected: boolean,
	questions: BankQuestion[],
}

export type BankQuestionUpdate = Omit<BankQuestion, 'id'>;
export type BankSurveyUpdatePayload = Omit<BankSurvey, 'id' | 'questions'> & {
	questions: BankQuestionUpdate[],
}

export class SurveyBankModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return surveyClient.get('/survey-bank', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: BankSurveyUpdatePayload, projection?: Projection) {
		return surveyClient.put('/survey-bank', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(bankSurvey: Id, projection?: Projection) {
		return surveyClient.get<'/survey-bank/:bankSurvey'>(`/survey-bank/${bankSurvey}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(bankSurvey: Id, payload: BankSurveyUpdatePayload, projection?: Projection) {
		return surveyClient.patch<'/survey-bank/:bankSurvey'>(`/survey-bank/${bankSurvey}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(bankSurvey: Id) {
		return surveyClient.delete<'/survey-bank/:bankSurvey'>(`/survey-bank/${bankSurvey}`);
	}
}
