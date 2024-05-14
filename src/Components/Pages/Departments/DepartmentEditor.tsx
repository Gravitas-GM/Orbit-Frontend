import * as React from 'react';
import {Button, Checkbox, ControlGroup, HTMLTable, InputGroup, Intent} from '@blueprintjs/core';
import {isValidationFailureError, ValidationFailures} from '../../../Api/errors/symfony';
import {Department, DepartmentCreatePayload, DepartmentModel} from '../../../Api/Hub/Models/Departments';
import {User, UserModel} from '../../../Api/Hub/Models/Users';
import {Spacing} from '../../../Styles/variables';
import {DeleteDialog} from '../../DeleteDialog';
import {ObjectList} from '../../ObjectList';
import {PageHeader} from '../../PageHeader';
import {toaster} from '../../../toaster';
import {Redirect, RouteComponentProps} from 'react-router';
import {renderUserName} from '../../Utility/string';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {FormControls} from '../../FormControls';
import {AddUsersDialog} from './AddUsersDialog';

interface IState {
	loading: boolean;
	redirect: boolean;
	validationFailures: ValidationFailures | null;
	processing: boolean;
	name: string;
	users: User[];
	members: User[];
	dirty: boolean;
	deleteTargets: User[];
	deleteSubject: string | undefined;
	selectedItems: User[];
	showAddUsersDialog: boolean;
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
		redirect: false,
		name: '',
		users: [],
		members: [],
		validationFailures: null,
		processing: false,
		dirty: false,
		deleteTargets: [],
		deleteSubject: undefined,
		selectedItems: [],
		showAddUsersDialog: false,
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
			members,
			users,
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

					<ObjectList
						title="Members"
						items={this.state.members}
						onItemFilter={this.onItemFilter}
						itemsPerPage={20}
						onAddNewClick={this.onAddNewClick}
						onBulkDeleteClick={this.onBulkDeleteClick}
						bulkDeleteDisabled={this.state.selectedItems.length === 0}
					>
						{items => (
							<HTMLTable striped={true}>
								<thead>
									<tr>
										<th style={{width: Spacing.XLarge}}>
											<Checkbox
												checked={this.isAllChecked()}
												onClick={this.onSelectAllClick}
											/>
										</th>

										<th>Name</th>
										<th style={{textAlign: 'center', width: 100}}>Delete</th>
									</tr>
								</thead>

								<tbody>
									{items.map(item => (
										<TableItem
											key={item.id}
											item={item}
											onDelete={this.onDeleteClick}
											onSelect={this.onSelectClick}
											isChecked={this.isChecked(item)}
										/>
									))}
								</tbody>
							</HTMLTable>
						)}
					</ObjectList>

					<FormControls
						onSaveClick={this.onSaveClick}
						loading={this.state.loading}
						dirty={this.state.dirty}
						redirectPath="/departments"
					/>
				</form>

				<DeleteDialog
					isOpen={this.state.deleteTargets.length > 0}
					multiple={this.state.deleteTargets.length > 1}
					onConfirm={this.onDeleteConfirm}
					onCancel={this.onDeleteCancel}
					subject={this.state.deleteSubject}
				/>

				{this.state.showAddUsersDialog && (
					<AddUsersDialog
						users={this.state.users.filter(user => !this.state.members.includes(user))}
						members={this.state.members}
						onClose={this.onAddUsersDialogClose}
						onSave={this.onAddUsersDialogSave}
					/>
				)}
			</section>
		);
	}

	private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
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

	private onItemFilter = (user: User, searchText: string) =>
		renderUserName(user).toLocaleLowerCase().includes(searchText);

	private isChecked = (item: User) => this.state.selectedItems.includes(item);

	private isAllChecked = () => this.state.selectedItems.length === this.state.members.length;

	private onSelectAllClick = () => {
		if (this.isAllChecked()) {
			this.setState({
				selectedItems: [],
			});
		} else {
			this.setState(state => ({
				selectedItems: [...state.members],
			}));
		}
	};

	private onSelectClick = (item: User) => {
		if (this.state.selectedItems.includes(item))
			this.setState(state => ({
				selectedItems: state.selectedItems.filter(selectedItem => selectedItem !== item),
			}));
		else
			this.setState(state => ({
				selectedItems: [...state.selectedItems, item],
			}));
	};

	private onAddNewClick = () => this.setState({
		showAddUsersDialog: true,
	});

	private onAddUsersDialogClose = () => this.setState({
		showAddUsersDialog: false,
	});

	private onAddUsersDialogSave = (selectedUsers: User[]) => this.setState(state => ({
		members: [...state.members, ...selectedUsers],
		showAddUsersDialog: false,
		dirty: true,
	}));

	private onDeleteClick = (target: User) => this.setState({
		deleteTargets: [target],
		deleteSubject: renderUserName(target),
	});

	private onBulkDeleteClick = () => this.setState(state => {
		const targets = [...state.selectedItems];
		const subject = targets.length > 1 ? undefined : renderUserName(targets[0]);

		return {
			deleteTargets: targets,
			deleteSubject: subject,
		};
	});

	private onDeleteConfirm = async () => {
		if (this.state.deleteTargets.length === 0)
			return;

		this.setState(state => ({
			members: state.members.filter(item => !state.deleteTargets.includes(item)),
			selectedItems: state.selectedItems.filter(item => !state.deleteTargets.includes(item)),
			deleteTargets: [],
		}));
	};

	private onDeleteCancel = () => this.setState({
		deleteTargets: [],
		deleteSubject: undefined,
	});
}

interface TableItemProps {
	item: User;
	onDelete: (item: User) => void;
	onSelect: (item: User) => void;
	isChecked: boolean;
}

const TableItem: React.FC<TableItemProps> = ({item, onDelete, onSelect, isChecked}) => {
	const onDeleteButtonClick = React.useCallback(() => {
		onDelete(item);
	}, [item, onDelete]);

	const onSelectButtonClick = React.useCallback(() => {
		onSelect(item);
	}, [item, onSelect]);

	return (
		<tr>
			<td>
				<Checkbox checked={isChecked} onClick={onSelectButtonClick} />
			</td>

			<td>{renderUserName(item)}</td>

			<td style={{textAlign: 'center'}}>
				<Button
					icon="delete"
					intent={Intent.DANGER}
					onClick={onDeleteButtonClick}
					minimal={true}
				/>
			</td>
		</tr>
	);
};
