import { NonIdealState as Base, NonIdealStateProps, Icon as BPIcon } from '@blueprintjs/core';
import { IconSize } from '../IconSize';
import React from 'react';

type BaseProps = Omit<NonIdealStateProps, 'title'>;
type Props = BaseProps & {
	title: React.ReactNode;
};

export const NonIdealState: React.FC<Props> = ({ icon = false, ...props }) => (
	<Base {...props} icon={<Icon icon={icon} />} />
);

const Icon: React.FC<Pick<NonIdealStateProps, 'icon'>> = ({ icon }) => {
	if (typeof icon === 'string' || typeof icon === 'undefined')
		return <BPIcon size={IconSize.LARGE} icon={icon ?? 'wind'} />;
	else
		return null;
};
