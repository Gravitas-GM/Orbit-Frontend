import {H2, HTMLTable, Icon} from '@blueprintjs/core';
import * as React from 'react';
import {User, UserModel} from '../../../Api/Hub/Models/Users';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {compareStrings} from '../../Utility/string';

interface IState {
	users: User[];
	loading: boolean;
}

function sortUsers(a: User, b: User) {
	const compare = compareStrings(a.lastName ?? '', b.lastName ?? '');

	if (compare !== 0)
		return compare;

	return compareStrings(a.firstName ?? '', b.firstName ?? '');
}

export class UsersList extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		users: [],
		loading: true,
	}

	public async componentDidMount() {
		let users: User[] = [];

		try {
			users = await UserModel.list().then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();
		}

		this.setState({
			users: users.sort(sortUsers),
			loading: false,
		})
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<>
				<H2>Users</H2>

				<HTMLTable className={'bp4-html-table-striped'}>
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Admin</th>
							<th>Edit</th>
						</tr>
					</thead>
					<tbody>
						{this.state.users.map(user => (
							<tr>
								<td>`${user.firstName}  ${user.lastName}`</td>
								<td>${user.emailAddress}</td>
								<td>${user.admin ? 'Yes' : 'No'}</td>
								<td><Icon icon={'edit'} /></td>
							</tr>
						))}
					</tbody>
				</HTMLTable>
			</>
		);
	}
}
