import {Location, LocationState} from 'history';
import {ComponentType} from 'react';
import {useLocation} from 'react-router';
import {wrap} from '../../utility/component';

export interface WithLocationProps<S = LocationState> {
	location: Location<S>,
}

export function withLocation<P extends WithLocationProps>(component: ComponentType<P>) {
	return wrap('withLocation', component, () => ({
		location: useLocation(),
	}));
}
