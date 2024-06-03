import {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useQuery} from './useQuery';

type WrapFn = <T extends (...args: any[]) => any>(fn: T) => (...args: Parameters<T>) => ReturnType<T>;

interface WatchedQuery {
	append: (name: string, value: string) => void,
	set: (name: string, value: string) => void,
	delete: (name: string) => void,
	get: (name: string) => string | null,
}

export function useWatchedQuery(): WatchedQuery {
	const [sequence, setSequence] = useState(0);
	const navigate = useNavigate();
	const query = useQuery();

	useEffect(() => {
		// No need to run on initial mount.
		if (sequence <= 0)
			return;

		navigate({
			search: query.toString(),
		}, {
			replace: true,
		});
	}, [sequence]);

	const wrap: WrapFn = useMemo(() => {
		return fn => (...args) => {
			setSequence(seq => seq + 1);
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
