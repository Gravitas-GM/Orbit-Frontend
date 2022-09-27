import {Button, FormGroup, H1, InputGroup, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Redirect} from 'react-router';
import {tokenStorage} from '../../Api';
import {isValidationFailureError, ValidationFailures} from '../../Api/errors';
import {UserActivationModel} from '../../Api/Hub/Models/UserActivation';
import {Token} from '../../Api/jwt';
import * as toaster from '../../Toaster';
import './Activate.scss';
import {ValidationAwareFormGroup} from '../ValidationAwareFormGroup';

interface IState {
	password: string;
	confirmPassword: string;
	processing: boolean;
	redirect: boolean;
	validationFailures: ValidationFailures | null;
}

export class Activate extends React.PureComponent<{}, IState> {
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
			return <Redirect to='/login' />;

		return (
			<div id="activate">
				<div style={{textAlign: 'center', marginBottom: 10}}>
					<H1>
						Happy Orbit Activation
					</H1>
				</div>

				<form method="post" onSubmit={this.onSubmit} onKeyDown={this.onFormKeyDown}>
					<ValidationAwareFormGroup
						label="Create Password"
						labelFor="password"
						failures={this.state.validationFailures}
					>
						<InputGroup
							type="password"
							name="password"
							value={this.state.password}
							onChange={this.onPasswordChange}
						/>
					</ValidationAwareFormGroup>

					<FormGroup
						label="Confirm Password"
						labelFor="confirmPassword"
					>
						<InputGroup
							type="password"
							name="confirmPassword"
							value={this.state.confirmPassword}
							onChange={this.onConfirmPasswordChange}
						/>
					</FormGroup>

					<div style={{display: 'flex'}}>
						<div style={{flex: 1}}>
							<Button
								text="Submit"
								onClick={this.onSubmit}
								intent={Intent.PRIMARY}
								loading={this.state.processing}
							/>
						</div>
					</div>
				</form>
			</div>
		);
	}

	private onFormKeyDown = async (event: React.KeyboardEvent) => {
		if (event.code === 'KeyEnter')
			await this.onSubmit(event);
	};

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

		UserActivationModel.activate({password: this.state.password})
			.then(() => {
				toaster.show({
					intent: Intent.SUCCESS,
					message: 'Your account has been activated!',
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
