import {ComponentType, useEffect, useMemo} from 'react';
import {wrap} from '../utility/component';

export function useTitle(title?: string, skipPrefix = false): void {
	const titleValue = useMemo(() => {
		if (!title)
			return null;

		return (skipPrefix ? '' : 'Happy Orbit | ') + title;
	}, [title, skipPrefix]);

	useEffect(() => {
		if (!titleValue)
			return;

		const oldValue = document.title;
		document.title = titleValue;

		return () => {
			document.title = oldValue;
		};
	}, [titleValue]);
}

export function withTitle<Props>(title: string, Component: ComponentType<Props>) {
	return wrap('WithTitle', Component, () => {
		useTitle(title);
	});
}
