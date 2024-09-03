import {ComponentType, useMemo} from 'react';
import {useLocation} from 'react-router';
import {wrap} from '../utility/component';

export function useQuery(): URLSearchParams {
	const {search} = useLocation();
	return useMemo(() => new URLSearchParams(search), [search]);
}

export interface WithUrlQueryProps {
	query: URLSearchParams,
}

export function withUrlQuery<P extends WithUrlQueryProps>(component: ComponentType<P>) {
	return wrap('withUrlQuery', component, () => ({
		query: useQuery(),
	}));
}
