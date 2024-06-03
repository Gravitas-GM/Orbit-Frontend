import {Button, Intent, Spinner, SpinnerSize} from '@blueprintjs/core';
import {MultiSelect2, MultiSelect2Props} from '@blueprintjs/select';
import * as React from 'react';
import './MultiSelect.scss';

interface Props<T> extends MultiSelect2Props<T> {
	loading?: boolean;
	loadingSpinner?: React.ReactElement;
	onSelectAll?: () => void;
	onSelectNone?: () => void;
}

export function MultiSelect<T>({
	loading,
	loadingSpinner,
	popoverTargetProps,
	popoverProps,
	onSelectAll,
	onSelectNone,
	...selectProps
}: Props<T>): React.ReactElement {
	if (loading)
		return loadingSpinner ?? <Spinner intent={Intent.PRIMARY} size={SpinnerSize.SMALL} />;

	return (
		<div className="gm-multi-select">
			<MultiSelect2
				popoverProps={popoverProps ?? {
					matchTargetWidth: true,
					minimal: true,
				}}
				popoverTargetProps={popoverTargetProps ?? {
					className: 'full-width',
				}}
				{...selectProps}
			/>

			<div className="select-buttons">
				{onSelectAll && <Button icon="plus" text="Select All" onClick={onSelectAll} minimal={true} />}
				{onSelectNone && <Button icon="minus" text="Select None" onClick={onSelectNone} minimal={true} />}
			</div>
		</div>
	);
}