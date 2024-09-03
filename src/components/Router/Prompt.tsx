import * as React from 'react';
import {BlockerFunction, unstable_usePrompt} from 'react-router-dom';

interface Props {
	when: boolean | BlockerFunction,
	message?: string,
}

export function Prompt({message, ...props}: Props): React.ReactElement | null {
	unstable_usePrompt({
		...props,
		message: message ?? 'You have unsaved changes. Are you sure you want to leave?',
	});

	return null;
}
