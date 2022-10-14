import {NonIdealState as Base, NonIdealStateProps} from '@blueprintjs/core';
import React from 'react';

type BaseProps = Omit<NonIdealStateProps, 'title'>;
type Props = BaseProps & {
	title: React.ReactNode;
};

export const NonIdealState: React.FC<Props> = ({icon, ...props}) =>	<Base {...props} icon={icon ?? 'wind'} />;
