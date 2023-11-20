import {Button} from '@blueprintjs/core';
import React from 'react';

interface Props {
	onClick: () => Promise<void>,
	children?: React.ReactNode,
	text?: React.ReactNode,
}

export const DebugButton: React.FC<Props> = ({onClick, children, text}) => {
	const [processing, setProcessing] = React.useState(false);
	const onButtonClick = React.useCallback(async () => {
		setProcessing(true);

		try {
			await onClick();
		} finally {
			setProcessing(false);
		}
	}, [onClick]);

	return (
		<div>
			<Button onClick={onButtonClick} children={children} text={text} loading={processing} />
		</div>
	);
};
