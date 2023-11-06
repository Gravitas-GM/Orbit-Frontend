import {Button, Classes, Dialog, FormGroup, Intent, Switch} from '@blueprintjs/core';
import * as React from 'react';
import {User} from '../../../Api/Hub/Models/Users';
import {Permission} from '../../../Permission';

export type UpdatableUserData = Pick<User, 'permissions'>;

interface IProps {
	user: User;
	onClose: () => void;
	onSubmit: (update: UpdatableUserData) => Promise<void>;
}

interface IState {
	permissions: Permission[];
	admin: boolean;
	processing: boolean;
}

export class UserEditDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			...getInitialPermissionProps(props.user.permissions),
			processing: false,
		};
	}

	public componentDidUpdate = (prevProps: IProps) => {
		if (prevProps.user.permissions !== this.props.user.permissions)
			this.setState(getInitialPermissionProps(this.props.user.permissions));
	};

	public render() {
		return (
			<Dialog
				onClose={this.props.onClose}
				isCloseButtonShown={!this.state.processing}
				isOpen={true}
				title="Edit User Details"
			>
				<div className={Classes.DIALOG_BODY}>
					<form onSubmit={this.onSubmit}>
						<FormGroup
							labelFor="isAdmin"
						>
							<div className="settings-switch-container">
								<span>
									Admin
								</span>

								<Switch
									checked={this.state.admin}
									onChange={this.onAdminChange}
									large={true}
								/>
							</div>
						</FormGroup>
					</form>
				</div>

				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button
							text="Cancel"
							onClick={this.props.onClose}
							disabled={this.state.processing}
						/>

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

	private onAdminChange = () => {
		if (this.state.admin) {
			this.setState(state => ({
				admin: false,
				permissions: state.permissions.filter(p => p !== Permission.ADMIN),
			}));
		} else {
			this.setState(state => ({
				admin: true,
				permissions: [Permission.ADMIN, ...state.permissions],
			}));
		}
	};

	private onSubmit = async () => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		const permissions = [];

		if (this.state.admin)
			permissions.push(Permission.ADMIN);

		await this.props.onSubmit({
			permissions,
		});
	};
}

function getInitialPermissionProps(permissions: Permission[]): Pick<IState, 'permissions' | 'admin'> {
	return {
		permissions: [...permissions],
		admin: permissions.includes(Permission.ADMIN),
	};
}
