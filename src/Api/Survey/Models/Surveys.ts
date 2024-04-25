import {Create, Entity, Id, Projectable, Projection, QueryDocument, Stub, surveyClient} from '../../index';
import {Question, QuestionCreate, QuestionUpdate, SurveyQuestionKind} from './BankQuestions';
import {UpdateOrderPayload} from './BankSurveys';

export interface SurveyEndpoints {
	'/surveys': {
		GET: {
			response: Survey[];
		};

		PUT: {
			query: Projectable;
			body: SurveySubmissionPayload;
			response: SurveySubmission;
		};
	};

	'/surveys/:survey': {
		POST: {
			params: Id;
			body: SurveySubmissionFilter;
			response: Survey;
		}
	}

	'/surveys/current': {
		GET: {
			response: Survey;
		}
	}

	'/surveys/next': {
		GET: {
			response: Survey;
		}
	}

	'/surveys/next/questions': {
		PUT: {
			query: Projectable;
			body: QuestionCreate;
			response: Question[];
		};
	};

	'/surveys/next/questions/:question': {
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

	'/surveys/next/questions/update-order': {
		POST: {
			body: UpdateOrderPayload;
			response: void;
		}
	};
}

export interface Survey extends Entity {
	account: number;
	startedDate: Date;
	questions: Question[];
	submissions: SurveySubmission[];
}

interface SurveyResponseBase extends Entity {
	kind: SurveyQuestionKind;
	submission: Stub<SurveySubmission>;
	question: Stub<Question>;
}

export interface FreeTextResponse extends SurveyResponseBase {
	kind: SurveyQuestionKind.FreeText;
	response: string;
}

export interface ScaleResponse extends SurveyResponseBase {
	kind: SurveyQuestionKind.Scale;
	response: number;
}

export interface MultipleChoiceResponse extends SurveyResponseBase {
	kind: SurveyQuestionKind.Choice;
	responseIndex: number;
}

export type SurveyResponse = FreeTextResponse | ScaleResponse | MultipleChoiceResponse;

export interface SurveySubmission extends Entity {
	survey: Stub<Survey>;
	submittedDate: Date;
	responses: SurveyResponse[];
}

export interface SurveySubmissionFilter {
	drillDown: boolean;
}

export type SurveySubmissionPayload = Create<SurveySubmission, 'responses'> & {
	responses: Create<SurveyResponse>[];
};

export class SurveyModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return surveyClient.get('/surveys', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static submit(payload: SurveySubmissionPayload, projection?: Projection) {
		return surveyClient.put('/surveys', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(survey: Id, payload: SurveySubmissionFilter, projection?: Projection) {
		return surveyClient.post<'/surveys/:survey'>(`/surveys/${survey}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static takeSurvey() {
		return surveyClient.get('/surveys/current');
	}

	public static readNext(projection?: Projection) {
		return surveyClient.get('/surveys/next', {
			params: {
				p: projection,
			},
		});
	}

	public static createNextQuestion(payload: QuestionCreate, projection?: Projection) {
		return surveyClient.put('/surveys/next/questions', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static readNextQuestion(question: Id, projection?: Projection) {
		return surveyClient.get<'/surveys/next/questions/:question'>(`/surveys/next/questions/${question}`, {
			params: {
				p: projection,
			},
		});
	}

	public static updateNextQuestion(question: Id, payload: QuestionUpdate, projection?: Projection) {
		return surveyClient.patch<'/surveys/next/questions/:question'>(`/surveys/next/questions/${question}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static deleteNextQuestion(question: Id) {
		return surveyClient.delete<'/surveys/next/questions/:question'>(`/surveys/next/questions/${question}`);
	}

	public static updateQuestionOrder(payload: UpdateOrderPayload) {
		return surveyClient.patch('/surveys/next/questions/update-order', payload);
	}
}
