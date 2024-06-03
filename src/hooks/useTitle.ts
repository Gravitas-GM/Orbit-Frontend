import {useEffect, useMemo} from 'react';

export function useTitle(title: string, skipPrefix = false): void {
	const titleValue = useMemo(() => {
		return (skipPrefix ? '' : 'Happy Orbit | ') + title;
	}, [title, skipPrefix]);

	useEffect(() => {
		const oldValue = document.title;
		document.title = titleValue;

		return () => {
			document.title = oldValue;
		};
	}, [titleValue]);
}
