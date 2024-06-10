import {debug} from '../utility/debug';
import * as gameCatalogApi from './Game-Catalog';
import * as gameStateApi from './Game-State';
import * as hubApi from './Hub';
import {AuthenticationModel} from './Hub/Models/Authentication';
import {Token, TokenStorage} from './jwt';
import * as pointTrackingApi from './Point-Tracking';
import * as quizApi from './Quiz';
import * as surveyApi from './Survey';

export interface Entity {
	id: number,
}

/**
 * Used to define a type that is a stub of it's full signature. Normally used for related object fields in API
 * bodies, where the default behavior is to return an object with only the `id` field present instead of normalizing
 * the entire object graph. Since projection can be used to include additional fields, all fields other than `id`
 * are marked as optional.
 *
 * The optional `Include` generic type can be used to specify which fields are included by default, for cases in
 * which the stub object includes more than just `id`.
 */
export type Stub<T extends Entity, Include extends keyof T = 'id'> = Pick<T, Include> & Partial<Omit<T, Include>>;

/**
 * Converts a type to its "normal" form, e.g. Entity objects to their IDs and Date objects to strings.
 */
type Normal<T> = T extends Entity ? (T extends null ? number | null : number) :
	T extends Array<infer Inner> ? Array<Normal<Inner>> :
		T extends Date ? string : T;

type Normalize<T> = T extends Array<infer Inner> ? Array<Normalize<Inner>> : {
	[K in keyof T]: Normal<T[K]>;
};

/**
 * Used to define a type suitable for entity create payloads.
 *
 * The required `Include` generic type is used to indicate which fields on the entity must be included in the payload.
 * The optional `Exclude` generic type is used to indicate fields that should NOT be included in the payload.
 *
 * All other fields not named by either `Include` or `Exclude` (except for `id`) will be marked as optional.
 */
export type Create<T extends Entity, Include extends keyof T = keyof T, Exclude extends keyof T = never> =
	Normalize<Required<Omit<Pick<T, Include>, 'id' | Exclude>> & Partial<Omit<T, 'id' | Include | Exclude>>>;

/**
 * Used to define a type suitable for entity update payloads.
 *
 * The optional `Exclude` generic type is used to indicate which fields on the entity should NOT be included in the
 * payload.
 *
 * All other fields (except for `id`) will be marked as optional.
 */
export type Update<T extends Entity, Exclude extends keyof T = never> = Normalize<Partial<Omit<T, 'id' | Exclude>>>;

export interface QueryDocument {
	[key: string]: string | number | boolean | null | Array<any> | QueryDocument | QueryDocument[];
}

export type Projection = { [key: string]: true } | { [key: string]: false };

export type Queryable = {
	q?: QueryDocument;
};

export type Projectable = {
	p?: Projection;
};

export type Id = string | number;

export const hubApiClient = hubApi.init();
export const pointTrackingClient = pointTrackingApi.init();
export const gameStateClient = gameStateApi.init();
export const gameCatalogClient = gameCatalogApi.init();
export const quizClient = quizApi.init();
export const surveyClient = surveyApi.init();

export const tokenStorage = new TokenStorage();
tokenStorage.initialize();

export async function login(username: string, password: string) {
	const response = await AuthenticationModel.login({
		username,
		password,
	}).then(response => response.data);

	return new Token(response.token);
}

export function isAuthenticated() {
	return tokenStorage.getToken()?.isValid();
}

export type ListFn<T> = (projection?: Projection, query?: QueryDocument) => Promise<T[]>;
