import {Button} from '@blueprintjs/core';
import * as React from 'react';

interface Props {
	onClick: () => Promise<void>,
	children?: React.ReactNode,
	text?: React.ReactNode,
}

export function DebugButton({onClick, children, text}: Props): React.ReactElement {
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
}
