import * as React from 'react';
import {Button, FormGroup, H1, InputGroup, Intent} from '@blueprintjs/core';
import {toaster} from '../../toaster';
import {ValidationAwareFormGroup} from '../../components/ValidationAwareFormGroup';
import {Spacing} from '../../Styles/variables';
import {ValidationFailures} from '../../api/errors/symfony';

interface IProps {
	formHeader: string;
	processing: boolean;
	validationFailures: ValidationFailures | null;
	onSubmit: (password: string) => void;
}

export const SetPasswordForm: React.FC<IProps> = (props) => {
	const [password, setPassword] = React.useState('');
	const [confirmPassword, setConfirmPassword] = React.useState('');

	const onPasswordChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.currentTarget.value),
		[setPassword],
	);

	const onConfirmPasswordChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.currentTarget.value),
		[setConfirmPassword],
	);

	const onSubmitCallback = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!password) {
			toaster.show({
				intent: Intent.DANGER,
				message: 'Please provide a password.',
			});

			return;
		}

		if (password !== confirmPassword) {
			toaster.show({
				intent: Intent.DANGER,
				message: 'Passwords do not match.',
			});

			return;
		}

		props.onSubmit(password);
	}, [props.onSubmit, password, confirmPassword]);

	return (
		<div className="orbit-home-form">
			<div style={{textAlign: 'center', marginBottom: Spacing.Medium}}>
				<H1>
					{props.formHeader}
				</H1>
			</div>

			<form onSubmit={onSubmitCallback}>
				<ValidationAwareFormGroup
					label="New Password"
					labelFor="password"
					failures={props.validationFailures}
				>
					<InputGroup
						autoFocus={true}
						type="password"
						value={password}
						onChange={onPasswordChange}
					/>
				</ValidationAwareFormGroup>

				<FormGroup
					label="Confirm Password"
				>
					<InputGroup
						type="password"
						value={confirmPassword}
						onChange={onConfirmPasswordChange}
					/>
				</FormGroup>

				<Button
					type="submit"
					text="Submit"
					intent={Intent.PRIMARY}
					loading={props.processing}
				/>
			</form>
		</div>
	);
};
