import {useMemo, useState} from 'react';
import {history} from '../history';
import {useQuery} from './useQuery';

type WrapFn = <T extends (...args: any[]) => any>(context: any, fn: T) => (...args: Parameters<T>) => ReturnType<T>;

interface WatchedQuery {
	append: (name: string, value: string) => void,
	set: (name: string, value: string) => void,
	delete: (name: string) => void,
	get: (name: string) => string | null,
}

export function useWatchedQuery(): WatchedQuery {
	const [dirty, setDirty] = useState(false);
	const query = useQuery();

	if (dirty) {
		setDirty(false);
		history.replace({search: query.toString()});
	}

	const wrap: WrapFn = useMemo(() => {
		return (context, fn) => (...args) => {
			setDirty(true);
			return fn.call(context, ...args);
		};
	}, []);

	return useMemo(() => (
		{
			append: wrap(query, query.append),
			set: wrap(query, query.set),
			delete: wrap(query, query.delete),
			get: name => query.get(name),
		}
	), [query]);
}
