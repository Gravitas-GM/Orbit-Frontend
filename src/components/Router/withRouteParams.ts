import {ComponentType} from 'react';
import {useParams} from 'react-router';
import {wrap} from '../../utility/component';

export type WithRouteParamsProps<Params> = {
	params: { [K in keyof Params]?: string },
}

export function withRouteParams<P extends WithRouteParamsProps<Params>, Params>(component: ComponentType<P>) {
	return wrap('withRouteParams', component, () => ({
		params: useParams(),
	}));
}
