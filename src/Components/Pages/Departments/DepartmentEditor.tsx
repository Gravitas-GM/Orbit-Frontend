import * as React from 'react';
import {ControlGroup, InputGroup} from '@blueprintjs/core';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2'
import {ItemRenderer} from '@blueprintjs/select';
import {isValidationFailureError, ValidationFailures} from '../../../Api/errors/symfony';
import {Department, DepartmentCreatePayload, DepartmentModel} from '../../../Api/Hub/Models/Departments';
import {User, UserModel} from '../../../Api/Hub/Models/Users';
import {Spacing} from '../../../Styles/variables';
import {PageHeader} from '../../PageHeader';
import {toaster} from '../../../toaster';
import {Redirect, RouteComponentProps} from 'react-router';
import {MultiSelect} from '../../Select/MultiSelect';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {FormControls} from '../../FormControls';

interface IState {
	loading: boolean;
	users: User[];
	redirect: boolean;
	validationFailures: ValidationFailures | null;
	processing: boolean;
	name: string;
	autoAssign: boolean;
	members: User[];
	dirty: boolean;
}

interface IRouteProps {
	department?: string;
}

enum DeptEditorTitle {
	ADD = 'Add New Department',
	EDIT = 'Edit Department',
}

export class DepartmentEditor extends React.PureComponent<RouteComponentProps<IRouteProps>, IState> {
	public state: Readonly<IState> = {
		loading: true,
		users: [],
		redirect: false,
		name: '',
		members: [],
		autoAssign: false,
		validationFailures: null,
		processing: false,
		dirty: false,
	};

	public async componentDidMount() {
		let users: User[];

		try {
			users = await UserModel.list().then(response => response.data);
		} catch (error) {
			toaster.error('Could not load Users.');

			this.setState({
				redirect: true,
			});

			return;
		}

		const idParam = this.props.match.params.department;

		if (!idParam) {
			this.setState({
				users,
				loading: false,
			});

			return;
		}

		let department: Department;

		try {
			department = await DepartmentModel.read(idParam).then(response => response.data);
		} catch (error) {
			toaster.error('Could not find specified Department.');

			this.setState({
				redirect: true,
			});

			return;
		}

		const members: User[] = [];

		for (const member of department.members) {
			const found = users.find(user => user.id === member.id);

			if (found)
				members.push(found);
		}

		this.setState({
			users,
			members,
			name: department.name,
			loading: false,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;
		else if (this.state.redirect)
			return <Redirect to="/departments" />;

		return (
			<section className="gm-page-wrapper">
				<PageHeader title={this.props.match.params.department ? DeptEditorTitle.EDIT : DeptEditorTitle.ADD} />

				<form>
					<ControlGroup fill={true}>
						<ValidationAwareFormGroup
							labelFor="name"
							label="Department Name"
							failures={this.state.validationFailures}
							style={{paddingRight: Spacing.Large}}
						>
							<InputGroup
								name="name"
								fill={true}
								autoFocus={true}
								value={this.state.name}
								onChange={this.onNameChange}
							/>
						</ValidationAwareFormGroup>
					</ControlGroup>

					<ValidationAwareFormGroup
						labelFor="members"
						label="Select Users"
						failures={this.state.validationFailures}
					>
						<MultiSelect
							tagInputProps={{
								inputProps: {
									name: 'members',
								},
							}}
							fill={true}
							items={this.state.users}
							selectedItems={this.state.members}
							onItemSelect={this.onMemberSelectionChange}
							onRemove={this.onMemberRemove}
							onSelectAll={this.onSelectAllClick}
							onSelectNone={this.onSelectNoneClick}
							itemRenderer={this.userRenderer}
							tagRenderer={tagRenderer}
							noResults={<div>No results</div>}
						/>
					</ValidationAwareFormGroup>

					<FormControls
						onSaveClick={this.onSaveClick}
						loading={this.state.loading}
						dirty={this.state.dirty}
						redirectPath="/departments"
					/>
				</form>
			</section>
		);
	}

	private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
		dirty: true,
	});

	private onMemberSelectionChange = (user: User) => {
		if (this.state.members.includes(user)) {
			this.setState(state => ({
				members: state.members.filter(item => item !== user),
				dirty: true,
			}));
		} else {
			this.setState(state => ({
				members: [...state.members, user],
				dirty: true,
			}));
		}
	};

	private onMemberRemove = (target: User) => this.setState(state => ({
		members: state.members.filter(item => item.id !== target.id),
		dirty: true,
	}));

	private onSelectAllClick = () => this.setState({
		members: this.state.users,
		dirty: true,
	});

	private onSelectNoneClick = () => this.setState({
		members: [],
		dirty: true,
	});

	private onSaveClick = async () => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		try {
			await this.saveDepartment({
				name: this.state.name,
				members: this.state.members.map(item => item.id),
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
			redirect: true,
		});
	};

	private saveDepartment = async (department: DepartmentCreatePayload) => {
		if (this.props.match.params.department) {
			await DepartmentModel.update(this.props.match.params.department, department);
			toaster.success(`Department "${this.state.name}" updated successfully`);
		} else {
			await DepartmentModel.create(department);
			toaster.success(`Department "${this.state.name}" created successfully`);
		}
	};

	private userRenderer: ItemRenderer<User> = (user, state) => {
		if (!state.modifiers.matchesPredicate)
			return null;

		const selected = this.state.members.includes(user);

		return (
			<MenuItem
				roleStructure="listoption"
				key={user.id}
				active={state.modifiers.active}
				disabled={state.modifiers.disabled}
				text={`${user.firstName} ${user.lastName}`}
				onClick={state.handleClick}
				onFocus={state.handleFocus}
				icon={selected ? 'small-tick' : 'blank'}
			/>
		);
	};
}

const tagRenderer = (user: User) => {
	return `${user.firstName} ${user.lastName}`;
};
