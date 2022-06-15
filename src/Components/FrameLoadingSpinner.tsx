import {Intent, ISpinnerProps, Spinner} from '@blueprintjs/core';
import * as React from 'react';
import './FrameLoadingSpinner.scss';
import {classNames} from './Utility/dom';

export const FrameLoadingSpinner: React.FC<ISpinnerProps> = ({intent, className, ...props}) => (
	<Spinner
		intent={intent || Intent.PRIMARY}
		className={classNames(classNames, 'frame-loading-spinner')}
		{...props}
	/>
);

FrameLoadingSpinner.displayName = 'FrameLoadingSpinner';
