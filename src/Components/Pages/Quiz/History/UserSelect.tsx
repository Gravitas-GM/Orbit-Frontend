import * as React from 'react';
import {Button} from '@blueprintjs/core';
import {ItemRenderer} from '@blueprintjs/select';
import {User} from '../../../../Api/Hub/Models/Users';
import {PermissionContext, Permission} from '../../../../Permission';
import {Select} from '../../../Select/Select';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {ucwords} from '../../../Utility/string';

interface IProps {
	users: User[];
	onUserSelect: (user: User) => void;
	onUserClear: () => void;
	selectedUser: User | null;
}

export class UserSelect extends React.PureComponent<IProps, {}> {
	public render(){
		const {users, onUserClear, onUserSelect, selectedUser} = this.props;

		return (
			<PermissionContext.Consumer>
				{([isGranted]) => (
					isGranted(Permission.ADMIN) && (
						<div className="history-filter">
							<Select<User>
								items={users}
								itemRenderer={this.renderUserOption}
								onItemSelect={onUserSelect}
								onClear={onUserClear}
								noResults={(
									<MenuItem
										disabled={true}
										text="No results."
										roleStructure="listoption"
									/>
								)}
							>
								<Button
									text={selectedUser ? `Show only ${selectedUser.firstName} ${selectedUser.lastName}` : 'Show All Users'}
									rightIcon="caret-down"
									alignText="left"
									fill={true}
								/>
							</Select>
						</div>
					))}
			</PermissionContext.Consumer>
		)
	}

	private renderUserOption: ItemRenderer<User> = (user, {handleClick, handleFocus, modifiers}) => {
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
				text={ucwords(`${user.firstName} ${user.lastName}`)}
			/>
		);
	};
}
