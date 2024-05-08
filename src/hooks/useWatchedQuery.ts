import {useEffect, useMemo, useState} from 'react';
import {history} from '../history';
import {useQuery} from './useQuery';

type WrapFn = <T extends (...args: any[]) => any>(fn: T) => (...args: Parameters<T>) => ReturnType<T>;

interface WatchedQuery {
	append: (name: string, value: string) => void,
	set: (name: string, value: string) => void,
	delete: (name: string) => void,
	get: (name: string) => string | null,
}

export function useWatchedQuery(): WatchedQuery {
	const [dirty, setDirty] = useState(false);
	const query = useQuery();

	useEffect(() => {
		setDirty(false);
		history.replace({search: query.toString()});
	}, [dirty, query]);

	const wrap: WrapFn = useMemo(() => {
		return fn => (...args) => {
			setDirty(true);
			return fn.call(query, ...args);
		};
	}, [query]);

	return useMemo(() => (
		{
			append: wrap(query.append),
			set: wrap(query.set),
			delete: wrap(query.delete),
			get: name => query.get(name),
		}
	), [query]);
}
