import {Button, ButtonGroup, Classes, Intent, Spinner, SpinnerSize} from '@blueprintjs/core';
import {MultiSelect2, MultiSelect2Props} from '@blueprintjs/select';
import * as React from 'react';

interface Props<T> extends MultiSelect2Props<T> {
	loading?: boolean;
	loadingSpinner?: React.ReactElement;
	onClear?: () => void;
}

export function MultiSelect<T>({
	onClear,
	loading,
	loadingSpinner,
	popoverTargetProps,
	popoverProps,
	...selectProps
}: Props<T>): React.ReactElement {
	if (loading)
		return loadingSpinner ?? <Spinner intent={Intent.PRIMARY} size={SpinnerSize.SMALL} />;

	return (
		<ButtonGroup fill={true}>
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

			{!loading && (
				<Button
					className={Classes.FIXED}
					icon="cross"
					onClick={onClear}
					disabled={selectProps.selectedItems.length === 0}
				/>
			)}
		</ButtonGroup>
	);
}