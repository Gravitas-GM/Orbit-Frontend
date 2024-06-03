import {Button} from '@blueprintjs/core';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {ItemRenderer} from '@blueprintjs/select';
import * as React from 'react';
import {User} from '../../../Api/Hub/Models/Users';
import {Permission} from '../../../Api/permissions';
import {Select} from '../../../Components/Select/Select';
import {withPermissions, WithPermissionsProps} from '../../../contexts/SessionContext';

interface Props extends WithPermissionsProps {
	users: User[];
	onUserSelect: (user: User) => void;
	onUserClear: () => void;
	selectedUser: User | null;
}

class UserSelect extends React.PureComponent<Props> {
	public render() {
		if (!this.props.isPermissionGranted(Permission.Admin))
			return;

		const {
			users,
			onUserClear,
			onUserSelect,
			selectedUser,
		} = this.props;

		return (
			<div className="user-select">
				<Select<User>
					fill={true}
					items={users}
					itemRenderer={this.renderUserOption}
					itemListPredicate={this.userListPredicate}
					onItemSelect={onUserSelect}
					onClear={onUserClear}
					noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
				>
					<Button
						text={
							selectedUser
								? `Show only ${selectedUser.firstName} ${selectedUser.lastName}`
								: 'Show All Users'
						}
						rightIcon="caret-down"
						alignText="left"
						fill={true}
					/>
				</Select>
			</div>
		);
	}

	private userListPredicate = (query: string) => {
		query = query.toLocaleLowerCase();

		return this.props.users.filter(user => {
			const name = `${user.firstName} ${user.lastName}`.trim().toLocaleLowerCase();
			return name.includes(query);
		});
	};

	private renderUserOption: ItemRenderer<User> = (
		user,
		{
			handleClick,
			handleFocus,
			modifiers,
		},
	) => {
		if (!modifiers.matchesPredicate)
			return null;

		return (
			<MenuItem
				active={modifiers.active}
				disabled={modifiers.disabled}
				selected={this.props.selectedUser === user}
				key={user.id}
				onClick={handleClick}
				onFocus={handleFocus}
				roleStructure="listoption"
				text={`${user.firstName} ${user.lastName}`}
			/>
		);
	};
}

const Wrapped = withPermissions(UserSelect);
export {Wrapped as UserSelect};
