import {NonIdealState as Base, NonIdealStateProps} from '@blueprintjs/core';
import React from 'react';

type BaseProps = Omit<NonIdealStateProps, 'title'>;
type Props = BaseProps & {
	title: React.ReactNode;
	hideIcon?: boolean;
};

export const NonIdealState: React.FC<Props> = ({icon, hideIcon = false, ...props}) =>	<Base {...props} icon={hideIcon ? null : (icon ?? 'wind')}/>;
