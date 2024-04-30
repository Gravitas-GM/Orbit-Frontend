import * as React from 'react';
import {Button, Classes, Dialog, FormGroup, Intent} from '@blueprintjs/core';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {ItemRenderer} from '@blueprintjs/select';
import {User, UserModel} from '../../../Api/Hub/Models/Users';
import {UserContext} from '../../../Session';
import {toaster} from '../../../toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {MultiSelect} from '../../Select/MultiSelect';

interface IProps {
	members: User[];
	onClose: () => void;
	onSave: (selectedUsers: User[]) => void;
}

interface IState {
	users: User[];
	selectedUsers: User[];
	loading: boolean;
	processing: boolean;
}

export class AddUsersDialog extends React.PureComponent<IProps, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public constructor(props: IProps) {
		super(props);

		this.state = {
			users: [],
			selectedUsers: [],
			loading: true,
			processing: false,
		};
	}

	public async componentDidMount() {
		let users: User[];

		try {
			users = await UserModel.list().then(response => response.data);
		} catch (error) {
			toaster.error('Could not load Users.');

			this.props.onClose();

			return;
		}

		this.setState({
			users: users.filter(user => !this.props.members.includes(user)),
			loading: false,
		});
	}

	public render() {
		return (
			<Dialog
				isOpen
				onClose={this.props.onClose}
				title="Add Members"
				canOutsideClickClose={false}
			>
				<div className={Classes.DIALOG_BODY}>
					{this.state.loading ? <FrameLoadingSpinner /> : (
						<form onSubmit={this.onSubmit}>
							<FormGroup
								label="Select users to assign to the department"
								labelFor="selectedUsers"
								style={{display: 'flex'}}
							>
								<MultiSelect
									tagInputProps={{
										inputProps: {
											name: 'members',
										},
									}}
									fill={true}
									items={this.state.users}
									selectedItems={this.state.selectedUsers}
									onItemSelect={this.onUserSelectionChange}
									onRemove={this.onUserRemove}
									onSelectAll={this.onSelectAllClick}
									onSelectNone={this.onSelectNoneClick}
									itemRenderer={this.userRenderer}
									tagRenderer={tagRenderer}
									noResults={<div>No results</div>}
								/>
							</FormGroup>
						</form>
					)}
				</div>

				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button text="Cancel" onClick={this.props.onClose} disabled={this.state.processing} />

						<Button
							intent={Intent.PRIMARY}
							text="Submit"
							onClick={this.onSubmit}
							loading={this.state.processing}
							disabled={this.state.selectedUsers.length === 0}
						/>
					</div>
				</div>
			</Dialog>
		);
	}

	private onUserSelectionChange = (user: User) => {
		if (this.state.selectedUsers.includes(user)) {
			this.setState(state => ({
				selectedUsers: state.selectedUsers.filter(item => item !== user),
			}));
		} else {
			this.setState(state => ({
				selectedUsers: [...state.selectedUsers, user],
			}));
		}
	};

	private onUserRemove = (target: User) => this.setState(state => ({
		selectedUsers: state.selectedUsers.filter(item => item.id !== target.id),
	}));

	private onSelectAllClick = () => this.setState({
		selectedUsers: this.state.users,
	});

	private onSelectNoneClick = () => this.setState({
		selectedUsers: [],
	});

	private onSubmit = async (event: React.SyntheticEvent) => {
		event.preventDefault();

		this.props.onSave(this.state.selectedUsers);
	};

	private userRenderer: ItemRenderer<User> = (user, state) => {
		if (!state.modifiers.matchesPredicate)
			return null;

		const selected = this.state.selectedUsers.includes(user);

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
