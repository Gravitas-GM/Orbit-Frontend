import {ComponentType, ReactElement} from 'react';
import {Remove} from './types';

export type Wrap<T, X> = Remove<T, X>;
export type WrapperFn<T> = () => T;

export function wrap<P, I>(name: string, Component: ComponentType<P>, wrapper: WrapperFn<I>): ComponentType<Wrap<P, I>> {
	function Wrapped(props: Wrap<P, I>): ReactElement {
		// See outstanding Typescript bug that makes the `as` cast necessary.
		// https://github.com/Microsoft/TypeScript/issues/28938#issuecomment-450636046
		return <Component {...props as P} {...wrapper()} />;
	}

	const innerName = Component.displayName || Component.name || 'Component';
	Wrapped.displayName = `${name}(${innerName})`;

	return Wrapped;
}
