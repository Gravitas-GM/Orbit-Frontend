import * as React from 'react';
import {Select2 as BPSelect, Select2Props as BPSelectProps} from '@blueprintjs/select';
import {Button, ControlGroup} from '@blueprintjs/core';

interface Props<T> extends BPSelectProps<T> {
	onClear?: () => void;
}

export function Select<T>({onClear, ...selectProps}: Props<T>): React.ReactElement {
	return (
		<ControlGroup>
			<BPSelect {...selectProps} />
			{onClear && <Button icon="cross" onClick={onClear} />}
		</ControlGroup>
	);
}
