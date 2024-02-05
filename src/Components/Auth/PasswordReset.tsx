import * as React from 'react';
import {Button, FormGroup, H1, InputGroup, Intent} from '@blueprintjs/core';
import {Redirect} from 'react-router';
import {tokenStorage} from '../../Api';
import {PasswordResetModel} from '../../Api/Hub/Models/PasswordReset';
import {Token} from '../../Api/jwt';
import {toaster} from '../../toaster';
import './Login.scss';
import {ValidationAwareFormGroup} from '../ValidationAwareFormGroup';
import {Spacing} from '../../Styles/variables';
import {isValidationFailureError, ValidationFailures} from '../../Api/errors/symfony';

interface IState {
	password: string;
	confirmPassword: string;
	processing: boolean;
	redirect: boolean;
	validationFailures: ValidationFailures | null;
}

export class PasswordReset extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		password: '',
		confirmPassword: '',
		processing: false,
		redirect: false,
		validationFailures: null,
	};

	public componentDidMount() {
		if (!window.location.search)
			return;

		const urlParams = new URLSearchParams(window.location.search);

		if (!urlParams.has('token'))
			return;

		tokenStorage.setToken(new Token(urlParams.get('token')!));
	}

	public render(): JSX.Element {
		if (this.state.redirect)
			return <Redirect to="/login" />;

		return (
			<div className="orbit-home-form">
				<div style={{textAlign: 'center', marginBottom: Spacing.Medium}}>
					<H1>
						Password Reset
					</H1>
				</div>

				<form method="post" onSubmit={this.onSubmit}>
					<ValidationAwareFormGroup
						label="New Password"
						labelFor="password"
						failures={this.state.validationFailures}
					>
						<InputGroup
							autoFocus={true}
							type="password"
							value={this.state.password}
							onChange={this.onPasswordChange}
						/>
					</ValidationAwareFormGroup>

					<FormGroup
						label="Confirm Password"
						labelFor="password"
					>
						<InputGroup
							type="password"
							value={this.state.confirmPassword}
							onChange={this.onConfirmPasswordChange}
						/>
					</FormGroup>

					<div style={{display: 'flex'}}>
						<div style={{flex: 1}}>
							<Button
								type="submit"
								text="Submit"
								intent={Intent.PRIMARY}
								loading={this.state.processing}
							/>
						</div>
					</div>
				</form>
			</div>
		);
	}

	private onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		password: event.currentTarget.value,
	});

	private onConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		confirmPassword: event.currentTarget.value,
	});

	private onSubmit = async (event: React.SyntheticEvent<any>) => {
		event.preventDefault();

		if (this.state.processing)
			return;

		if (!this.state.password) {
			toaster.show({
				intent: Intent.DANGER,
				message: 'Please provide a password.',
			});

			return;
		}

		if (this.state.password !== this.state.confirmPassword) {
			toaster.show({
				intent: Intent.DANGER,
				message: 'Passwords do not match.',
			});

			return;
		}

		this.setState({
			processing: true,
		});

		PasswordResetModel.reset({password: this.state.password})
			.then(() => {
				toaster.show({
					intent: Intent.SUCCESS,
					message: 'Your password has been reset!',
				});

				this.setState({
					redirect: true,
				});
			})
			.catch(error => {
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
			});
	};
}
