import {gameCatalogClient, gameStateClient, hubApiClient, pointTrackingClient} from './index';
import {Permission} from './permissions';
import {Role} from './roles';

export type TokenRefreshedFn = (token: Token | null) => void;

export interface TokenEvents {
	changed: [token: Token | null],
}

type Listener<T extends keyof TokenEvents> = (...args: TokenEvents[T]) => void;

type Listeners = {
	[K in keyof TokenEvents]?: Array<Listener<K>>
};

export class TokenStorage {
	protected storageKey: string;
	protected token: Token | null = null;
	protected refreshTaskId: number | null = null;
	protected listeners: Listeners = {};

	public constructor(storageKey: string = 'api.auth_token') {
		this.storageKey = storageKey;
	}

	public addEventListener<Event extends keyof TokenEvents>(event: Event, listener: Listener<Event>): void {
		const listeners = this.getListenersForEvent(event);

		if (!listeners.includes(listener))
			listeners.push(listener);
	}

	public removeEventListener<Event extends keyof TokenEvents>(event: Event, listener: Listener<Event>): void {
		const listeners = this.getListenersForEvent(event);
		const index = listeners.indexOf(listener);

		if (index !== -1)
			listeners.splice(index, 1);
	}

	private getListenersForEvent<Event extends keyof TokenEvents>(event: Event): Array<Listener<Event>> {
		const listeners = this.listeners[event];

		if (listeners)
			return listeners;

		this.listeners[event] = [];
		return this.listeners[event]!;
	}

	private dispatchEvent<Event extends keyof TokenEvents>(event: Event, ...args: TokenEvents[Event]): void {
		for (const listener of this.getListenersForEvent(event))
			listener(...args);
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

		this.dispatchEvent('changed', this.token);
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
	permissions: Permission[];
}

export class Token {
	public readonly jwt: string;
	public readonly body: JWTBody;

	public constructor(jwt: string) {
		this.jwt = jwt;
		this.body = JSON.parse(window.atob(jwt.substring(jwt.indexOf('.') + 1, jwt.lastIndexOf('.'))));
	}

	public isValid() {
		return this.getTimeToLive() > 0;
	}

	public getTimeToLive() {
		return this.body.exp - Math.floor(Date.now() / 1000);
	}
}
