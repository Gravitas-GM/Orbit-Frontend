import {ControlGroup, FormGroup, InputGroup, Radio, RadioGroup} from '@blueprintjs/core';
import * as React from 'react';
import {isValidationFailureError, ValidationFailures} from '../../../api/errors/symfony';
import {User, UserModel} from '../../../api/Hub/Models/Users';
import {Permission} from '../../../api/permissions';
import {FormControls} from '../../../components/FormControls';
import {ValidationAwareFormGroup} from '../../../components/ValidationAwareFormGroup';
import {withPermissions, WithPermissionsProps} from '../../../contexts/SessionContext';
import {toaster} from '../../../toaster';

interface Props extends WithPermissionsProps {
	user: User,
}

interface State {
	admin: boolean,
	dirty: boolean,
	firstName: string;
	lastName: string;
	processing: boolean,
	validationFailures: ValidationFailures | null;
}

class UserTab extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			...getInitialPermissionProps(props.user.permissions),
			dirty: false,
			firstName: props.user.firstName ?? '',
			lastName: props.user.lastName ?? '',
			processing: false,
			validationFailures: null,
		};
	}

	public componentDidUpdate(prevProps: Readonly<Props>): void {
		if (this.props.user === prevProps.user)
			return;

		this.setState(getInitialPermissionProps(this.props.user.permissions));
	}

	public render() {
		const redirectPath = this.props.isPermissionGranted(Permission.Admin) ? '/users' : '/';

		return (
			<form>
				<ControlGroup fill={true} style={{gap: 10}}>
					<ValidationAwareFormGroup label="First Name" labelFor="firstName" failures={this.state.validationFailures}>
						<InputGroup name="firstName" value={this.state.firstName} onChange={this.onFirstNameChange} />
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup label="Last Name" labelFor="lastName" failures={this.state.validationFailures}>
						<InputGroup name="lastName" value={this.state.lastName} onChange={this.onLastNameChange} />
					</ValidationAwareFormGroup>

					<FormGroup label="Email Address" labelFor="emailAddress" helperText="Can only be updated via Slack">
						<InputGroup name="emailAddress" disabled={true} value={this.props.user.emailAddress} />
					</FormGroup>

					<RadioGroup
						onChange={this.onAdminChange}
						label="Is Administrator?"
						selectedValue={+this.state.admin}
						inline={true}
					>
						<Radio label="Yes" value={+true} />
						<Radio label="No" value={+false} />
					</RadioGroup>
				</ControlGroup>

				<FormControls
					onSaveClick={this.onSave}
					loading={this.state.processing}
					dirty={this.state.dirty}
					redirectPath={redirectPath}
				/>
			</form>
		);
	}

	private onFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		firstName: event.currentTarget.value,
		dirty: true,
	});

	private onLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		lastName: event.currentTarget.value,
		dirty: true,
	});

	private onAdminChange = () => this.setState(state => (
		{
			admin: !state.admin,
			dirty: true,
		}
	));

	private onSave = async () => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		try {
			await UserModel.update(this.props.user.id, {
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				admin: this.state.admin,
			});
		} catch (error) {
			if (isValidationFailureError(error)) {
				toaster.showValidationFailedErrorMessage();

				this.setState({
					validationFailures: error.context.failures,
				});
			} else
				toaster.showUnhandledErrorMessage();

			return;
		} finally {
			this.setState({
				processing: false,
			});
		}

		this.setState({
			dirty: false,
		});

		toaster.success('User updated.');
	};
}

const Wrapped = withPermissions(UserTab);
export {Wrapped as UserTab};

function getInitialPermissionProps(permissions: Permission[]): Pick<State, 'admin'> {
	return {
		admin: permissions.includes(Permission.Admin),
	};
}
