import * as React from 'react';
import {Prompt as BasePrompt, PromptProps} from 'react-router';
import {Location, Action} from 'history';

// The `Prompt` component provided by react-router will trigger even when navigating to the same page the app is already
// on, which doesn't actually trigger any component replacement. I'm not sure if this is a "bug" exactly, but it isn't
// the behavior we want.
export default function Prompt({message, ...props}: PromptProps): React.ReactElement {
	const handler = React.useCallback((loc: Location, action: Action) => {
		if (loc.pathname === window.location.pathname)
			return true;

		if (typeof message === 'function')
			return message(loc, action);
		else
			return message;
	}, [message]);

	return <BasePrompt message={handler} {...props} />;
}
