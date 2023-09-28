import {FormGroup as BPFormGroup, FormGroupProps, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {ValidationFailures} from '../Api/errors/symfony';
import {extract} from './Utility/validation';

interface IProps extends FormGroupProps {
	labelFor: string;
	failures: ValidationFailures | null;
	exactMatch?: boolean;
}

export const ValidationAwareFormGroup: React.FC<IProps> = ({failures, exactMatch = true, ...props}) => {
	if (failures) {
		const failure = extract(failures, props.labelFor, exactMatch);

		if (failure) {
			props.helperText = failure.message;
			props.intent = Intent.DANGER;
		}
	}

	return <BPFormGroup {...props} />;
};

ValidationAwareFormGroup.displayName = `ValidationAwareFormGroup(${BPFormGroup.displayName})`;
