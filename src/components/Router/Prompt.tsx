import * as React from 'react';
import {BlockerFunction, unstable_usePrompt } from 'react-router-dom';

interface Props {
	when: boolean | BlockerFunction,
	message: string,
}

export function Prompt(props: Props): React.ReactElement | null {
	unstable_usePrompt(props);
	return null;
}
