import {ControlGroup, FormGroup, InputGroup, Radio, RadioGroup} from '@blueprintjs/core';
import * as React from 'react';
import {User, UserModel} from '../../../../Api/Hub/Models/Users';
import {Permission, PermissionContext} from '../../../../Permission';
import {toaster} from '../../../../toaster';
import {FormControls} from '../../../FormControls';
import {renderUserName} from '../../../Utility/string';

interface Props {
	user: User,
}

interface State {
	admin: boolean,
	dirty: boolean,
	processing: boolean,
}

export class UserTab extends React.PureComponent<Props, State> {
	static contextType = PermissionContext;
	declare context: React.ContextType<typeof PermissionContext>;

	public constructor(props: Props) {
		super(props);

		this.state = {
			...getInitialPermissionProps(props.user.permissions),
			dirty: false,
			processing: false,
		};
	}

	public componentDidUpdate(prevProps: Readonly<Props>): void {
		if (this.props.user === prevProps.user)
			return;

		this.setState(getInitialPermissionProps(this.props.user.permissions));
	}

	public render() {
		const [hasPermission] = this.context;
		const redirectPath = hasPermission(Permission.ADMIN) ? '/users' : '/';

		return (
			<form>
				<ControlGroup fill={true} style={{gap: 10}}>
					<FormGroup label="Name" labelFor="name" helperText="Can only be updated via Slack">
						<InputGroup name="name" disabled={true} value={renderUserName(this.props.user)} />
					</FormGroup>

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
				admin: this.state.admin,
			});
		} catch {
			// TODO Once we can modify other user fields (like name) here, we'll need to check for validation errors
			//  /tyler
			toaster.showUnhandledErrorMessage();
		}
	};
}

function getInitialPermissionProps(permissions: Permission[]): Pick<State, 'admin'> {
	return {
		admin: permissions.includes(Permission.ADMIN),
	};
}
