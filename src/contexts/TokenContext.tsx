import * as React from 'react';
import {tokenStorage} from '../api';
import {Token, TokenRefreshedFn} from '../api/jwt';
import {wrap} from '../utility/component';
import {ManagerProps} from './index';

export type SetTokenFn = (token: Token | null) => void;

export interface State {
	token: Token | null,
	setToken: SetTokenFn,
}

export const TokenContext = createContext<State>({
	token: null,
	setToken: () => {
	},
});

export function useToken(): State {
	return useContext(TokenContext);
}

export interface WithTokenProps {
	token: Token | null,
	setToken: SetTokenFn,
}

export function withToken<P extends WithTokenProps>(component: ComponentType<P>) {
	return wrap('withToken', component, () => useToken());
}

export function TokenManager({children}: ManagerProps): ReactElement {
	const [token, setToken] = useState<Token | null>(() => tokenStorage.getToken());

	const onTokenChanged = useCallback<TokenRefreshedFn>(token => {
		setToken(token);
	}, []);

	useEffect(() => {
		tokenStorage.addEventListener('changed', onTokenChanged);
		return () => tokenStorage.removeEventListener('changed', onTokenChanged);
	}, [onTokenChanged]);

	const setTokenFn = useCallback<SetTokenFn>(token => {
		tokenStorage.setToken(token);
	}, [onTokenChanged]);

	const state = useMemo<State>(() => ({
		token,
		setToken: setTokenFn,
	}), [token]);

	return (
		<TokenContext.Provider value={state}>
			{children}
		</TokenContext.Provider>
	);
}
