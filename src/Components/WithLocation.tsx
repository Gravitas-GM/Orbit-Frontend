import {Location, LocationState} from 'history';
import * as React from 'react';
import {useLocation} from 'react-router';
import {Remove} from '../utility/types';

export interface WithLocationProps<S = LocationState> {
	location: Location<S>,
}

type Wrap<T> = Remove<T, WithLocationProps>;

export function withLocation<P extends WithLocationProps = WithLocationProps>(
	Component: React.ComponentType<P>,
): React.ComponentType<Wrap<P>> {
	function Wrapped(props: Wrap<P>): React.ReactElement {
		const location = useLocation();

		// See outstanding Typescript bug that makes the `as` cast necessary.
		// https://github.com/Microsoft/TypeScript/issues/28938#issuecomment-450636046
		return <Component {...props as P} location={location} />;
	}

	const name = Component.displayName || Component.name || 'Component';
	Wrapped.displayName = `WithLocation(${name})`;

	return Wrapped;
}
