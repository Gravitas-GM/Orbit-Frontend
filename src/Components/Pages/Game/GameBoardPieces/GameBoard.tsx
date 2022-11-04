import * as React from 'react';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';

interface IProps {
	imageUrl: string;
	loading: boolean;
}

export const GameBoard: React.FC<IProps> = ({ imageUrl, loading }) => {
	if (loading)
		return <FrameLoadingSpinner />;

	return (
		<img src={imageUrl} alt='Game Board Background' style={{maxWidth: '100%'}} />
	);
};

GameBoard.displayName = 'GameBoard';
