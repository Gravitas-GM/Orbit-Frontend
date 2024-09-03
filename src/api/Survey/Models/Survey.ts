import {parseApiTimestamp} from '../../../utility/date';
import {Account} from '../../Hub/Models/Accounts';
import {Entity, Id, Identity, Projectable, Projection, QueryDocument, Stub, surveyClient} from '../../index';
import {QuestionKind} from '../index';
import {Department} from './Department';
import {SurveyQuestion} from './SurveyQuestion';

export interface SurveyEndpoints {
	'/surveys': {
		GET: {
			response: Survey[],
		},
	},

	'/surveys/:id': {
		GET: {
			params: Identity,
			query: Projectable,
			response: Survey,
		},
	},

	'/surveys/current': {
		GET: {
			query: Projectable,
			response: Survey,
		},
	},

	'/surveys/next': {
		GET: {
			query: Projectable,
			response: Survey,
		},
	},

	'/surveys/results': {
		GET: {
			query: Projectable,
			response: Survey,
		},
	},
}

export interface Survey extends Entity {
	account: Stub<Account>,
	startedDate: Date,
	questions: SurveyQuestion[],
}

export interface Submission extends Entity {
	survey: Stub<Survey>,
	department?: Department,
	submittedDate: Date,
	submissions: SurveyResponse[],
}

interface SurveyResponseBase extends Entity {
	kind: QuestionKind,
	submission: Stub<Submission>,
	question: SurveyQuestion,
}

export interface ChoiceResponse extends SurveyResponseBase {
	kind: QuestionKind.Choice,
	response: number,
}

export interface FreeTextResponse extends SurveyResponseBase {
	kind: QuestionKind.FreeText,
	response: string,
}

export interface ScaleResponse extends SurveyResponseBase {
	kind: QuestionKind.Scale,
	response: number,
}

export type SurveyResponse = ChoiceResponse | FreeTextResponse | ScaleResponse;

export class SurveyModel {
	public static async list(projection?: Projection, query?: QueryDocument) {
		const response = await surveyClient.get('/surveys', {
			params: {
				p: projection,
				q: query,
			},
		});

		response.data = response.data.map(SurveyModel.denormalize);

		return response;
	}

	public static async read(id: Id, projection?: Projection) {
		const response = await surveyClient.get<'/surveys/:id'>(`/surveys/${id}`, {
			params: {
				p: projection,
			},
		});

		response.data = SurveyModel.denormalize(response.data);
		return response;
	}

	public static async readCurrent(projection?: Projection) {
		const response = await surveyClient.get('/surveys/current', {
			params: {
				p: projection,
			},
		});

		response.data = SurveyModel.denormalize(response.data);
		return response;
	}

	public static async readNext(projection?: Projection) {
		const response = await surveyClient.get('/surveys/next', {
			params: {
				p: projection,
			},
		});

		response.data = SurveyModel.denormalize(response.data);
		return response;
	}

	public static async readCurrentResults(projection?: Projection) {
		const response = await surveyClient.get('/surveys/results', {
			params: {
				p: projection,
			},
		});

		response.data = SurveyModel.denormalize(response.data);
		return response;
	}

	protected static denormalize(survey: Survey): Survey {
		survey.startedDate = parseApiTimestamp(survey.startedDate);

		return survey;
	}
}
