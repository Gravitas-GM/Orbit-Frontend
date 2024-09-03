import {Button, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {ReactEventHandler} from 'react';
import {Navigate, RelativeRoutingType} from 'react-router-dom';
import {ConfirmDialog} from './ConfirmDialog';
import './FormControls.scss';
import {Prompt} from './Router/Prompt';

interface Props {
	onSaveClick: ReactEventHandler,
	loading: boolean,
	dirty: boolean,
	redirectPath: string,
	redirectRelative?: RelativeRoutingType,
	children?: React.ReactNode,
}

export function FormControls({
	onSaveClick,
	loading,
	children,
	dirty,
	redirectPath,
	redirectRelative,
}: Props): React.ReactElement {
	const [redirect, setRedirect] = React.useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

	const onCancelClick = React.useCallback(() => {
		// We only want to confirm navigation if the form has been altered.
		if (dirty)
			setShowConfirmDialog(true);
		else
			setRedirect(true);
	}, [dirty]);

	const onDialogConfirmClick = React.useCallback(() => setRedirect(true), []);
	const onDialogCancelClick = React.useCallback(() => setShowConfirmDialog(false), []);

	if (redirect)
		return <Navigate to={redirectPath} relative={redirectRelative} />;

	return (
		<div id="form-controls">
			<div className="left-controls">
				{children}
			</div>

			<div className="right-controls">
				<Button text="Cancel" onClick={onCancelClick} disabled={loading} />
				<Button text="Save" intent={Intent.PRIMARY} onClick={onSaveClick} loading={loading} />
			</div>

			<ConfirmDialog onConfirm={onDialogConfirmClick} onCancel={onDialogCancelClick} isOpen={showConfirmDialog}>
				Are you sure you want to discard your changes?
			</ConfirmDialog>

			<Prompt
				when={dirty && !redirect}
				message="Are you sure you want to leave? You have unsaved changes."
			/>
		</div>
	);
}
