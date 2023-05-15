import {FormGroup as BPFormGroup, FormGroupProps, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {ValidationFailures} from '../Api/errors/symfony';

interface IProps extends FormGroupProps {
	labelFor: string;
	failures: ValidationFailures | null;
	exactMatch?: boolean;
}

export const ValidationAwareFormGroup: React.FC<IProps> = ({failures, exactMatch, ...props}) => {
	if (failures) {
		if (props.labelFor in failures) {
			props.helperText = failures[props.labelFor].message;
			props.intent = Intent.DANGER;
		} else if (!exactMatch) {
			for (let key in failures) {
				if (!failures.hasOwnProperty(key))
					continue;

				if (key.indexOf(props.labelFor) === 0) {
					props.helperText = failures[key].message;
					props.intent = Intent.DANGER;
				}
			}
		}
	}

	return <BPFormGroup {...props} />;
};

ValidationAwareFormGroup.displayName = `ValidationAwareFormGroup(${BPFormGroup.displayName})`;
