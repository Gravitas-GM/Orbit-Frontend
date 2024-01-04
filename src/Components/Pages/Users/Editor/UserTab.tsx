import * as React from 'react';
import {Button, ControlGroup, FormGroup, InputGroup, Radio, RadioGroup} from '@blueprintjs/core';
import {isValidationFailureError, ValidationFailures} from '../../../../Api/errors/symfony';
import {User, UserModel} from '../../../../Api/Hub/Models/Users';
import {Permission, PermissionContext} from '../../../../Permission';
import {toaster} from '../../../../toaster';
import {FormControls} from '../../../FormControls';
import {Select} from '../../../Select/Select';
import {Department, DepartmentModel} from '../../../../Api/Hub/Models/Departments';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {ItemRenderer} from '@blueprintjs/select';
import {Stub} from '../../../../Api';

interface Props {
	user: User,
}

interface State {
	admin: boolean,
	dirty: boolean,
	firstName: string;
	lastName: string;
	processing: boolean,
	validationFailures: ValidationFailures | null;
	departments: Department[];
	selectedDepartment:  Stub<Department, 'id' | 'name'> | null;
}

export class UserTab extends React.PureComponent<Props, State> {
	static contextType = PermissionContext;
	declare context: React.ContextType<typeof PermissionContext>;

	public constructor(props: Props) {
		super(props);

		this.state = {
			...getInitialPermissionProps(props.user.permissions),
			dirty: false,
			firstName: props.user.firstName ?? '',
			lastName: props.user.lastName ?? '',
			processing: false,
			validationFailures: null,
			departments: [],
			selectedDepartment: props.user.department ?? null,
		};
	}

	public async componentDidMount(): Promise<void> {
		let departments: Department[] = [];

		try {
			departments = await DepartmentModel.list().then(res => res.data);
		} catch (error) {
			toaster.error("Failed to load departments data.");

			return;
		}

		this.setState({
			departments,
		});
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
			<form style={{display: 'flex', flexDirection: 'column'}}>
				<ControlGroup fill={true} style={{gap: 10}}>
					<FormGroup label="First Name" labelFor="firstName">
						<InputGroup name="firstName" value={this.state.firstName} onChange={this.onFirstNameChange} />
					</FormGroup>

					<FormGroup label="Last Name" labelFor="lastName">
						<InputGroup name="lastName" value={this.state.lastName} onChange={this.onLastNameChange} />
					</FormGroup>
				</ControlGroup>

				<ControlGroup fill={true} style={{gap: 10}}>
					<FormGroup label="Email Address" labelFor="emailAddress" helperText="Can only be updated via Slack">
						<InputGroup name="emailAddress" disabled={true} value={this.props.user.emailAddress} />
					</FormGroup>

					<FormGroup style={{flex: 1}} label="Department" labelFor="department">
						<Select<Department>
							fill={true}
							filterable={false}
							items={this.state.departments}
							itemRenderer={this.renderDepartmentOption}
							onClear={this.onDepartmentClear}
							onItemSelect={this.onDepartmentSelect}
							noResults={(
								<MenuItem
									disabled={true}
									text="No results."
									roleStructure="listoption"
								/>
							)}
						>
							<Button
								alignText="left"
								fill={true}
								text={this.state.selectedDepartment ? this.state.selectedDepartment.name : 'Select a department'}
								rightIcon="double-caret-vertical"
								placeholder="Select a department"
							/>
						</Select>
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
					department: this.state.selectedDepartment?.id ?? null,
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

	private onDepartmentClear = () => this.setState(state => ({
		selectedDepartment: null,
		dirty: state.selectedDepartment !== null,
	}));

	private onDepartmentSelect = (department: Department) => this.setState({
		selectedDepartment: {
			id: department.id,
			name: department.name
		},
		dirty: true,
	});

	private renderDepartmentOption: ItemRenderer<Department> = (item, {handleClick, handleFocus, modifiers}) => {
		if (!modifiers.matchesPredicate)
			return null;

		return (
			<MenuItem
				key={item.id}
				text={item.name}
				selected={item.id === this.state.selectedDepartment?.id}
				active={modifiers.active}
				disabled={modifiers.disabled}
				onClick={handleClick}
				onFocus={handleFocus}
				roleStructure="listoption"
			/>
		);
	};
}

function getInitialPermissionProps(permissions: Permission[]): Pick<State, 'admin'> {
	return {
		admin: permissions.includes(Permission.ADMIN),
	};
}
