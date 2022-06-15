import {Button, H2, HTMLTable} from '@blueprintjs/core';
import * as React from 'react';
import {User, UserModel} from '../../../Api/Hub/Models/Users';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {classNames} from '../../Utility/dom';
import {compareStrings, ucwords} from '../../Utility/string';
import {history} from '../../../history';

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
	};

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
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<>
				<H2>Users</H2>

				<HTMLTable className={classNames('bp4-html-table-striped')}>
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
							<tr key={`user-${user.id}`}>
								<td>{ucwords(user.firstName ?? '')} {ucwords(user.lastName ?? '')}</td>
								<td>{user.emailAddress}</td>
								<td>{user.admin ? 'Yes' : 'No'}</td>
								<td>
									<Button
										icon='edit'
										minimal={true}
										onClick={() => history.push(`/users/${user.id}`)}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</HTMLTable>
			</>
		);
	}
}
