import {Button, ControlGroup} from '@blueprintjs/core';
import {Select as BPSelect, SelectProps as BPSelectProps} from '@blueprintjs/select';
import {ReactElement} from 'react';

export type ItemSelectFn<T> = BPSelectProps<T>['onItemSelect'];

interface Props<T> extends BPSelectProps<T> {
	onClear?: () => void;
}

export function Select<T>({onClear, ...selectProps}: Props<T>): ReactElement {
	return (
		<ControlGroup>
			<BPSelect {...selectProps} />
			{onClear && <Button icon="cross" onClick={onClear} />}
		</ControlGroup>
	);
}
