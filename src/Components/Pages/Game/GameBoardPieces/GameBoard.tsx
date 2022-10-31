import * as React from 'react';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import { Classes } from '../../../../classes';
import './GameBoard.scss';

interface IProps {
	imageUrl: string;
	loading: boolean;
}

export const GameBoard: React.FC<IProps> = ({ imageUrl, loading }) => {
	if (loading)
		return <FrameLoadingSpinner />;

	return (
		<div className={Classes.GAME_BOARD_CONTAINER}>
			<img src={imageUrl} alt='Game Board Background' />
		</div>
	);
};

GameBoard.displayName = 'GameBoard';
