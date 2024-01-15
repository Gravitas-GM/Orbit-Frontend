import * as React from 'react';
import {Button} from '@blueprintjs/core';
import {ItemRenderer} from '@blueprintjs/select';
import {User} from '../../../../Api/Hub/Models/Users';
import {QuizSubmission} from '../../../../Api/Quiz/Models/QuizSubmissions';
import {PermissionContext, Permission} from '../../../../Permission';
import {Select} from '../../../Select/Select';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {ucwords} from '../../../Utility/string';

interface IProps {
	users: User[];
	onUserSelect: (user: User) => void;
	onUserClear: () => void;
	filteredSubmissions: QuizSubmission[] | null;
}

export const UserSelect: React.FC<IProps> = ({users, onUserSelect, onUserClear, filteredSubmissions}) => {
	const [isGranted] = React.useContext(PermissionContext);

	if (!isGranted(Permission.ADMIN))
		return null;

	return (
		<div className="history-filter">
			<span>Sort by</span>

			<Select<User>
				items={users}
				noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
				itemRenderer={renderUserOption}
				onItemSelect={onUserSelect}
			>
				<Button>
					{filteredSubmissions && filteredSubmissions.length >= 1
						? `${filteredSubmissions[0].user.name}`
						: 'All Users'}
				</Button>
			</Select>

			<Button minimal={true} small={true} onClick={onUserClear}>
				Clear filter
			</Button>
		</div>
	);
};

const renderUserOption: ItemRenderer<User> = (user, {handleClick, handleFocus, modifiers}) => {
	if (!modifiers.matchesPredicate)
		return null;

	return (
		<MenuItem
			active={modifiers.active}
			disabled={modifiers.disabled}
			key={user.id}
			onClick={handleClick}
			onFocus={handleFocus}
			roleStructure="listoption"
			text={ucwords(`${user.firstName} ${user.lastName}`)}
		/>
	);
};
