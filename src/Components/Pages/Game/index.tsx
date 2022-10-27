import {H1} from '@blueprintjs/core';
import * as React from 'react';
import {UserContext} from '../../../Session';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';

interface IState {
	loading: boolean;
}

export class GameBoard extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		loading: true,
	};

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<H1>Game Board</H1>
		);
	}
}
