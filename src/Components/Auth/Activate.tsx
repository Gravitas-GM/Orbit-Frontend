import * as React from 'react';
import {Intent} from '@blueprintjs/core';
import {Redirect} from 'react-router';
import {tokenStorage} from '../../Api';
import {UserActivationModel} from '../../Api/Hub/Models/UserActivation';
import {Token} from '../../Api/jwt';
import {toaster} from '../../toaster';
import './Login.scss';
import {isValidationFailureError, ValidationFailures} from '../../Api/errors/symfony';
import {SetPasswordForm} from './SetPasswordForm';

interface IState {
	processing: boolean;
	redirect: boolean;
	validationFailures: ValidationFailures | null;
}

export class Activate extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
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
			<SetPasswordForm
				formHeader="Happy Orbit Activation"
				processing={this.state.processing}
				validationFailures={this.state.validationFailures}
				onSubmit={this.onSubmit}
			/>
		);
	}

	private onSubmit = async (password: string) => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		UserActivationModel.activate({password: password})
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
