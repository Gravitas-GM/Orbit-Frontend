import {Button, FormGroup, H1, InputGroup, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {isAuthenticated, login, tokenStorage} from '../../Api';
import {ApiError} from '../../Api/errors';
import {User, UserModel} from '../../Api/Hub/Models/Users';
import * as toaster from '../../Toaster';
import {getPreviousPathFromState} from '../Utility/router';
import './Login.scss';

interface IProps extends RouteComponentProps {
	onLoginSuccess: (user: User) => void;
}

interface IState {
	emailAddress: string;
	password: string;
	processing: boolean;
	redirect: boolean;
}

class Login extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		emailAddress: '',
		password: '',
		processing: false,
		redirect: false,
	};

	public render(): JSX.Element {
		if (this.state.redirect || isAuthenticated())
			return <Redirect to={getPreviousPathFromState()} />;

		return (
			<div id="login">
				<div style={{textAlign: 'center', marginBottom: 10}}>
					<H1>
						Happy Orbit
					</H1>
				</div>

				<form method="post" onSubmit={this.onLoginSubmit} onKeyDown={this.onFormKeyDown}>
					<FormGroup label="Email Address">
						<InputGroup value={this.state.emailAddress} onChange={this.onEmailAddressChange} />
					</FormGroup>

					<FormGroup label="Password">
						<InputGroup type="password" value={this.state.password} onChange={this.onPasswordChange} />
					</FormGroup>

					<div style={{display: 'flex'}}>
						<div style={{flex: 1}}>
							<Button
								text="Submit"
								onClick={this.onLoginSubmit}
								intent={Intent.PRIMARY}
								loading={this.state.processing}
							/>
						</div>
					</div>
				</form>
			</div>
		);
	}

	private onFormKeyDown = (event: React.KeyboardEvent) => {
		if (event.keyCode === 13)
			this.onLoginSubmit(event);
	};

	private onEmailAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		emailAddress: event.currentTarget.value,
	});

	private onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		password: event.currentTarget.value,
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

		login(this.state.emailAddress, this.state.password)
			.then(() => {
				const userId = tokenStorage.getToken()?.body.sub;

				if (!userId) {
					console.error('Login completed, but no user ID was available');

					return;
				}

				UserModel.read(userId)
					.then(response => {
						toaster.show({
							intent: Intent.SUCCESS,
							message: 'You have been logged in successfully.',
						});

						this.setState({
							redirect: true,
						}, () => this.props.onLoginSuccess(response.data));
					});
			})
			.catch(err => {
				toaster.show({
					intent: Intent.DANGER,
					message: err instanceof ApiError ?
						err.message :
						'An error occurred while attempting to log you in. Please try again.',
				});

				this.setState({
					processing: false,
				});
			});
	};
}

const WrappedLogin = withRouter(Login);
export {WrappedLogin as Login};
