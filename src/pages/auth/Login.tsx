import {Button, FormGroup, H1, InputGroup, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Navigate} from 'react-router-dom';
import {isAuthenticated, login} from '../../api';
import {ApiError} from '../../api/errors/symfony';
import {Token} from '../../api/jwt';
import {ForgotPasswordDialog} from './ForgotPasswordDialog';
import {StartActivationDialog} from './StartActivationDialog';
import {withLocation, WithLocationProps} from '../../components/Router/withLocation';
import {TokenContext} from '../../contexts/TokenContext';
import {Spacing} from '../../Styles/variables';
import {toaster} from '../../toaster';
import {getPreviousPathFromState} from '../../utility/router';
import './Login.scss';

interface State {
	emailAddress: string;
	password: string;
	processing: boolean;
	redirect: boolean;
	showActivationDialog: boolean;
	showForgotPasswordDialog: boolean;
}

class Login extends React.PureComponent<WithLocationProps, State> {
	static contextType = TokenContext;
	declare context: React.ContextType<typeof TokenContext>;

	public state: Readonly<State> = {
		emailAddress: '',
		password: '',
		processing: false,
		redirect: false,
		showActivationDialog: false,
		showForgotPasswordDialog: false,
	};

	public componentDidMount() {
		if (isAuthenticated()) {
			this.setState({
				redirect: true,
			});
		}
	}

	public render(): JSX.Element {
		if (this.state.redirect)
			return <Navigate to={getPreviousPathFromState(this.props.location)} />;

		return (
			<div className="orbit-home-form">
				<div style={{textAlign: 'center', marginBottom: Spacing.Medium}}>
					<H1>
						Happy Orbit
					</H1>
				</div>

				<form method="post" onSubmit={this.onLoginSubmit}>
					<FormGroup label="Email Address">
						<InputGroup
							value={this.state.emailAddress}
							onChange={this.onEmailAddressChange}
							autoFocus={true}
						/>
					</FormGroup>

					<FormGroup label="Password">
						<InputGroup type="password" value={this.state.password} onChange={this.onPasswordChange} />
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

						<Button
							text="Forgot Password"
							style={{marginRight: Spacing.Medium}}
							onClick={this.onForgotPasswordClick}
						/>

						<Button text="Start Activation" onClick={this.onStartActivationButtonClick} />
					</div>
				</form>

				{this.state.showActivationDialog && (
					<StartActivationDialog onClose={this.onActivationDialogClose} />
				)}

				{this.state.showForgotPasswordDialog && (
					<ForgotPasswordDialog onClose={this.onForgotPasswordDialogClose} />
				)}
			</div>
		);
	}

	private onEmailAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		emailAddress: event.currentTarget.value,
	});

	private onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		password: event.currentTarget.value,
	});

	private onStartActivationButtonClick = () => this.setState({
		showActivationDialog: true,
	});

	private onActivationDialogClose = () => this.setState({
		showActivationDialog: false,
	});

	private onForgotPasswordClick = () => this.setState({
		showForgotPasswordDialog: true,
	});

	private onForgotPasswordDialogClose = () => this.setState({
		showForgotPasswordDialog: false,
	});

	private onLoginSubmit = async (event: React.SyntheticEvent<any>) => {
		event.preventDefault();

		if (this.state.processing)
			return;

		if (!this.state.emailAddress || !this.state.password) {
			toaster.show({
				intent: Intent.DANGER,
				message: 'Please provide both an email address and a password.',
			});

			return;
		}

		this.setState({
			processing: true,
		});

		let token: Token;

		try {
			token = await login(this.state.emailAddress, this.state.password);
		} catch (error) {
			toaster.show({
				intent: Intent.DANGER,
				message: error instanceof ApiError ?
					error.message :
					'An error occurred while attempting to log you in. Please try again.',
			});

			return;
		} finally {
			this.setState({
				processing: false,
			});
		}

		this.context.setToken(token);

		this.setState({
			redirect: true,
		});
	};
}

const WrappedLogin = withLocation(Login);
export {WrappedLogin as Login};
