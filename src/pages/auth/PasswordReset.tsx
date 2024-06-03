import {Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Navigate} from 'react-router-dom';
import {tokenStorage} from '../../Api';
import {isValidationFailureError, ValidationFailures} from '../../Api/errors/symfony';
import {PasswordResetModel} from '../../Api/Hub/Models/PasswordReset';
import {Token} from '../../Api/jwt';
import {withToken, WithTokenProps} from '../../contexts/TokenContext';
import {withUrlQuery, WithUrlQueryProps} from '../../hooks/useQuery';
import {toaster} from '../../toaster';
import '../../Components/Auth/Login.scss';
import {SetPasswordForm} from './SetPasswordForm';

type Props = WithUrlQueryProps & WithTokenProps;

interface State {
	processing: boolean;
	redirect: string | null;
	validationFailures: ValidationFailures | null;
}

class PasswordReset extends React.PureComponent<Props, State> {
	public state: Readonly<State> = {
		processing: false,
		redirect: null,
		validationFailures: null,
	};

	public componentDidMount() {
		const rawToken = this.props.query.get('token');

		if (!rawToken) {
			toaster.error('Invalid password reset request.');
			this.setState({
				redirect: '/login',
			});

			return;
		}

		tokenStorage.setToken(new Token(rawToken));
	}

	public render(): JSX.Element {
		if (this.state.redirect)
			return <Navigate to={this.state.redirect} />;

		return (
			<SetPasswordForm
				formHeader="Password Reset"
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

		try {
			await PasswordResetModel.reset({password: password});
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

		toaster.show({
			intent: Intent.SUCCESS,
			message: 'Your password has been reset!',
		});

		this.setState({
			redirect: '/',
		});
	};
}

const Wrapped = withUrlQuery(withToken(PasswordReset));
export {Wrapped as PasswordReset};
