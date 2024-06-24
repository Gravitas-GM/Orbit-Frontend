import {parseApiTimestamp} from '../../../utility/date';
import {Account} from '../../Hub/Models/Accounts';
import {Entity, Projectable, Projection, QueryDocument, Stub, surveyClient} from '../../index';
import {SurveyQuestion} from './SurveyQuestion';

export interface SurveyEndpoints {
	'/surveys': {
		GET: {
			response: Survey[],
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
}

export interface Survey extends Entity {
	account: Stub<Account>,
	startedDate: Date,
	questions: SurveyQuestion[],
}

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

	public static readCurrent(projection?: Projection) {
		return surveyClient.get('/surveys/current', {
			params: {
				p: projection,
			},
		});
	}

	public static readNext(projection?: Projection) {
		return surveyClient.get('/surveys/next', {
			params: {
				p: projection,
			},
		});
	}

	protected static denormalize(survey: Survey): Survey {
		survey.startedDate = parseApiTimestamp(survey.startedDate);

		return survey;
	}
}
