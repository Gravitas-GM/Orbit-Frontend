import {FormGroup as BPFormGroup, FormGroupProps, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {ValidationFailures} from '../Api/errors/symfony';
import {extract} from '../utility/validation';

interface IProps extends FormGroupProps {
	labelFor: string;
	failures: ValidationFailures | null;
	exactMatch?: boolean;
	failureMessage?: React.ReactNode;
}

export const ValidationAwareFormGroup: React.FC<IProps> = ({failures, failureMessage, exactMatch = true, ...props}) => {
	if (failures) {
		const failure = extract(failures, props.labelFor, exactMatch);

		if (failure) {
			props.helperText = failureMessage ?? failure.message;
			props.intent = Intent.DANGER;
		}
	}

	return <BPFormGroup {...props} />;
};

ValidationAwareFormGroup.displayName = `ValidationAwareFormGroup(${BPFormGroup.displayName})`;
