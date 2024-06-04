import {useEffect, useMemo} from 'react';

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
