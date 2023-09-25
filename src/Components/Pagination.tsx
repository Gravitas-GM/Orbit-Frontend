import * as React from 'react';
import {Button} from '@blueprintjs/core';

interface Props {
	page: number;
	totalPages: number;
	onNext: () => void;
	onBack: () => void;
}

export const Pagination: React.FC<Props> = ({page, totalPages, onNext, onBack}) => {
	if (totalPages <= 1)
		return null;

	return (
		<div className="pagination">
			<Button
				disabled={page === 1}
				onClick={onBack}
				icon="caret-left"
				text="Prev"
			/>

			<span>
				{page}/{totalPages}
			</span>

			<Button
				disabled={page === totalPages}
				onClick={onNext}
				icon="caret-right"
				text="Next"
			/>
		</div>
	);
};
