import * as React from 'react';
import {Button, Classes, Dialog, DialogProps, Intent} from '@blueprintjs/core';

interface Props extends Omit<DialogProps, 'onClose'> {
	onConfirm: () => void;
	onCancel: () => void;
}

export const ConfirmDialog: React.FC<Props> = ({
	title,
	onConfirm,
	onCancel,
	children,
	canOutsideClickClose,
	canEscapeKeyClose,
	...dialogProps
}) => (
	<Dialog
		title={title ?? 'Confirm'}
		onClose={onCancel}
		canOutsideClickClose={canOutsideClickClose ?? false}
		canEscapeKeyClose={canEscapeKeyClose ?? false}
		{...dialogProps}
	>
		<div className={Classes.DIALOG_BODY}>
			{children}
		</div>

		<div className={Classes.DIALOG_FOOTER}>
			<div className={Classes.DIALOG_FOOTER_ACTIONS}>
				<Button text="Cancel" onClick={onCancel} />
				<Button text="Confirm" onClick={onConfirm} intent={Intent.PRIMARY} />
			</div>
		</div>
	</Dialog>
);
