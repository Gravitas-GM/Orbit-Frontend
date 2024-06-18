import {Intent, Spinner, SpinnerProps} from '@blueprintjs/core';
import './FrameLoadingSpinner.scss';
import {ReactElement} from 'react';
import {useTitle} from '../hooks/useTitle';
import {classNames} from '../utility/dom';

export function FrameLoadingSpinner({intent, className, ...props}: SpinnerProps): ReactElement {
	useTitle('Loading...');

	return (
		<Spinner
			intent={intent || Intent.PRIMARY}
			className={classNames(classNames, 'frame-loading-spinner')}
			{...props}
		/>
	);
}
