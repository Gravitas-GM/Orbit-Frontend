import {Button, IconName, MaybeElement, Popover} from '@blueprintjs/core';
import {ReactElement} from 'react';

interface Props {
	children: JSX.Element,
	icon?: IconName | MaybeElement,
}

export function ControlsMenu({icon, children}: Props): ReactElement {
	return (
		<Popover content={children}>
			<Button icon={icon ?? 'more'} minimal={true} />
		</Popover>
	);
}
