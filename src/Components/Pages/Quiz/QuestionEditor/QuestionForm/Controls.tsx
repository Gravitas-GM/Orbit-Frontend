import * as React from 'react';
import {Redirect} from 'react-router';
import {Button, Intent} from '@blueprintjs/core';
import {ConfirmDialog} from '../../../../ConfirmDialog';

interface Props {
	onSaveClick: () => void;
	loading: boolean;
	dirty: boolean;
	children?: React.ReactNode;
}

export const Controls: React.FC<Props> = ({onSaveClick, loading, children, dirty}) => {
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
		return <Redirect to="/quiz/questions" />;

	return (
		<div className="form-controls">
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
		</div>
	);
};
