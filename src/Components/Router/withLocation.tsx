import {ComponentType} from 'react';
import {useLocation} from 'react-router';
import {wrap} from '../../utility/component';

export interface WithLocationProps {
	location: ReturnType<typeof useLocation>,
}

export function withLocation<P extends WithLocationProps>(component: ComponentType<P>) {
	return wrap('withLocation', component, () => ({
		location: useLocation(),
	}));
}
