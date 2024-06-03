import * as React from 'react';
import {ManagerProps} from './index';

export type SetLoadingFn = (loading: boolean) => void;
export interface LoadingContextValue {
	loading: boolean,
	setLoading: SetLoadingFn,
}

export const LoadingContext = React.createContext<LoadingContextValue>({
	loading: false,
	setLoading: () => {
	},
});

export function useGlobalLoading(): LoadingContextValue {
	return React.useContext(LoadingContext);
}

export function LoadingManager({children}: ManagerProps): React.ReactElement {
	const [loading, setLoading] = React.useState(false);
	const value = React.useMemo<LoadingContextValue>(() => ({
		loading,
		setLoading,
	}), [loading]);

	return (
		<LoadingContext.Provider value={value}>
			{children}
		</LoadingContext.Provider>
	);
}
