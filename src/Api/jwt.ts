import {hubApiClient, pointTrackingClient, gameCatalogClient, gameStateClient} from './index';
import {Role} from '../Role';

export class TokenStorage {
	protected storageKey: string;
	protected token: Token | null = null;
	protected refreshTaskId: number | null = null;

	public constructor(storageKey: string = 'api.auth_token') {
		this.storageKey = storageKey;
	}

	public initialize() {
		const jwt = window.localStorage.getItem(this.storageKey);

		if (jwt)
			this.setToken(new Token(jwt));
	}

	public getToken() {
		return this.token;
	}

	public setToken(token: Token | null) {
		if (token && (!token.isValid() || token.getTimeToLive() < 5))
			token = null;

		this.token = token;

		// TODO: Move this somewhere better - need to minimize places where clients are modified
		if (!token) {
			window.localStorage.removeItem(this.storageKey);
			this.clearRefreshTask();

			delete hubApiClient.defaults.headers.authorization;
			delete pointTrackingClient.defaults.headers.authorization;
			delete gameStateClient.defaults.headers.authorization;
			delete gameCatalogClient.defaults.headers.authorization;
		} else {
			hubApiClient.defaults.headers.authorization = `Bearer ${token.jwt}`;
			pointTrackingClient.defaults.headers.authorization = `Bearer ${token.jwt}`;
			gameStateClient.defaults.headers.authorization = `Bearer ${token.jwt}`;
			gameCatalogClient.defaults.headers.authorization = `Bearer ${token.jwt}`;

			window.localStorage.setItem(this.storageKey, token.jwt);
			this.scheduleRefreshTask();
		}
	}

	protected scheduleRefreshTask() {
		const token = this.getToken();

		if (!token)
			return;

		this.clearRefreshTask();

		window.setTimeout(async () => {
			const response = await hubApiClient.get('/auth/refresh');

			this.setToken(new Token(response.data.token));
		}, Math.max((token.getTimeToLive() - 60) * 1000, 1));
	}

	protected clearRefreshTask() {
		if (!this.refreshTaskId)
			return;

		window.clearTimeout(this.refreshTaskId);

		this.refreshTaskId = null;
	}
}

interface JWTBody {
	exp: number;
	iat: number;
	roles: Role[];
	userIdentifier: string;
	id: number;
	accountId: number;
	permissions: string[];
}

export class Token {
	public readonly jwt: string;
	public readonly body: JWTBody;

	public constructor(jwt: string) {
		this.jwt = jwt;
		this.body = JSON.parse(atob(jwt.substring(jwt.indexOf('.') + 1, jwt.lastIndexOf('.'))));
	}

	public isValid() {
		return this.getTimeToLive() > 0;
	}

	public getTimeToLive() {
		return this.body.exp - Math.ceil(Date.now() / 1000);
	}

	public static DEBUG_fromObject(token: JWTBody) {
		return new Token('.' + btoa(JSON.stringify(token)) + '.');
	}
}
