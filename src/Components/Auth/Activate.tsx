import {Button, FormGroup, H1, InputGroup, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Redirect} from 'react-router';
import {tokenStorage} from '../../Api';
import {ApiError} from '../../Api/errors';
import {UserActivationModel} from '../../Api/Hub/Models/UserActivation';
import {Token} from '../../Api/jwt';
import * as toaster from '../../Toaster';
import './Activate.scss';

interface IState {
	password: string;
	processing: boolean;
	redirect: boolean;
}

export class Activate extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		password: '',
		processing: false,
		redirect: false,
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
			return <Redirect to={"/"} />;

		return (
			<div id="activate">
				<div style={{textAlign: 'center', marginBottom: 10}}>
					<H1>
						Happy Orbit Activation
					</H1>
				</div>

				<form method="post" onSubmit={this.onSubmit} onKeyDown={this.onFormKeyDown}>
					<FormGroup label="Create Password">
						<InputGroup type="password" value={this.state.password} onChange={this.onPasswordChange} />
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

	private onFormKeyDown = (event: React.KeyboardEvent) => {
		if (event.keyCode === 13)
			this.onSubmit(event);
	};

	private onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		password: event.currentTarget.value,
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

		this.setState({
			processing: true,
		});

		UserActivationModel.activate({password: this.state.password})
			.then(() => {
				toaster.show({
					intent: Intent.SUCCESS,
					message: 'Your account has been activated and you can now log in.',
				});

				this.setState({
					redirect: true,
				});
			})
			.catch(err => {
				toaster.show({
					intent: Intent.DANGER,
					message: err instanceof ApiError ?
						err.message :
						'An error occurred while attempting to activate your account. Please try again.',
				});

				this.setState({
					processing: false,
				});
			});
	};
}
