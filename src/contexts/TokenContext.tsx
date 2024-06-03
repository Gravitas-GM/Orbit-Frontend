import * as React from 'react';
import {tokenStorage} from '../Api';
import {Token, TokenRefreshedFn} from '../Api/jwt';
import {ManagerProps} from './index';

export type SetTokenFn = (token: Token | null) => void;

export interface State {
	token: Token | null,
	setToken: SetTokenFn,
}

export const TokenContext = React.createContext<State>({
	token: null,
	setToken: () => {
	},
});

export function useToken(): State {
	return React.useContext(TokenContext);
}

export function TokenManager({children}: ManagerProps): React.ReactElement {
	const [token, setToken] = React.useState<Token | null>(() => tokenStorage.getToken());

	const onTokenRefreshed = React.useCallback<TokenRefreshedFn>(token => {
		setToken(token);
	}, []);

	const setTokenFn = React.useCallback<SetTokenFn>(token => {
		tokenStorage.setToken(token, onTokenRefreshed);
		setToken(token);
	}, [onTokenRefreshed]);

	const state = React.useMemo<State>(() => ({
		token,
		setToken: setTokenFn,
	}), [token]);

	return (
		<TokenContext.Provider value={state}>
			{children}
		</TokenContext.Provider>
	);
}
