import {Button, Classes, Dialog, InputGroup, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {UserActivationModel} from '../../Api/Hub/Models/UserActivation';
import * as toaster from '../../Toaster';
import {isValidationFailureError, ValidationFailures} from '../../Api/errors';
import {ValidationAwareFormGroup} from '../ValidationAwareFormGroup';

interface IProps {
	onClose: () => void;
}

interface IState {
	emailAddress: string;
	processing: boolean;
	validationFailures: ValidationFailures | null;
}

export class StartActivationDialog extends React.PureComponent<IProps, IState> {
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
			<Dialog onClose={this.props.onClose} isOpen={true} title="Start Activation">
				<div className={Classes.DIALOG_BODY}>
					<p className={Classes.RUNNING_TEXT}>
						To start the activation, enter your email address in the form below. An activation link will be
						sent to you within a few minutes.
					</p>

					<form onSubmit={this.onSubmit}>
						<ValidationAwareFormGroup
							label="Email Address"
							labelFor="emailAddress"
							failures={this.state.validationFailures}
						>
							<InputGroup value={this.state.emailAddress} onChange={this.onEmailAddressChange} />
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

	private onEmailAddressChange = async (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
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
			await UserActivationModel.startActivation(
				{
					userEmailAddress: this.state.emailAddress,
					activationUrlTemplate: 'happyorbit.com/activate/:code'
				});
		} catch (error) {
			if (isValidationFailureError(error)) {
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
			'Your activation request has been received. Please follow the instructions sent to your email.'
		);

		this.setState({
			processing: false,
			validationFailures: null,
		});

		this.props.onClose();
	};
}
