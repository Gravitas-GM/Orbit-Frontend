import * as React from 'react';
import {Button, Classes, Dialog, InputGroup, Intent} from '@blueprintjs/core';
import {ApiError, ValidationFailures} from '../../Api/errors/symfony';
import {PasswordResetModel} from '../../Api/Hub/Models/PasswordReset';
import {toaster} from '../../toaster';
import {ValidationAwareFormGroup} from '../ValidationAwareFormGroup';

interface IProps {
	onClose: () => void;
}

interface IState {
	emailAddress: string;
	processing: boolean;
	validationFailures: ValidationFailures | null;
}

export class ForgotPasswordDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			emailAddress: '',
			processing: false,
			validationFailures: null,
		};
	}

	public render(): JSX.Element {
		return (
			<Dialog onClose={this.props.onClose} isOpen={true} title="Forgot Password">
				<div className={Classes.DIALOG_BODY}>
					<p className={Classes.RUNNING_TEXT}>
						To request a password reset, enter your email address in the form below. A reset link will be
						sent to you within a few minutes.
					</p>

					<form onSubmit={this.onSubmit}>
						<ValidationAwareFormGroup
							label="Email Address"
							labelFor="userEmailAddress"
							failures={this.state.validationFailures}
						>
							<InputGroup
								autoFocus={true}
								value={this.state.emailAddress}
								onChange={this.onEmailAddressChange}
							/>
						</ValidationAwareFormGroup>
					</form>
				</div>

				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button text="Cancel" onClick={this.props.onClose} disabled={this.state.processing} />

						<Button
							intent={Intent.PRIMARY}
							text="Submit"
							onClick={this.onSubmit}
							loading={this.state.processing}
						/>
					</div>
				</div>
			</Dialog>
		);
	}

	private onEmailAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		emailAddress: event.currentTarget.value,
	});

	private onSubmit = async (event: React.SyntheticEvent<any>) => {
		event.preventDefault();

		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		try {
			await PasswordResetModel.requestReset(
				{
					userEmailAddress: this.state.emailAddress,
					resetUrlTemplate: 'https://app.happyorbit.com/password-reset?token=:code',
				});
		} catch (error) {
			if (error instanceof ApiError && error.isValidationFailure()) {
				toaster.showValidationFailedErrorMessage();

				this.setState({
					validationFailures: error.context.failures,
				});
			} else
				toaster.showUnhandledErrorMessage();

			this.setState({
				processing: false,
			});

			return;
		}

		toaster.success(
			'Your password reset request has been received. Please follow the instructions sent to your email.',
		);

		this.setState({
			processing: false,
			validationFailures: null,
		});

		this.props.onClose();
	};
}
