import {AnchorButton, H2, HTMLTable} from '@blueprintjs/core';
import * as React from 'react';
import {User, UserModel} from '../../../Api/Hub/Models/Users';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {compareStrings, ucwords} from '../../Utility/string';

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

			return;
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

				<HTMLTable striped={true}>
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Admin</th>
							<th style={{textAlign: 'right'}}>Edit</th>
						</tr>
					</thead>

					<tbody>
						{this.state.users.map(user => (
							<tr key={`user-${user.id}`}>
								<td>{ucwords(user.firstName ?? '')} {ucwords(user.lastName ?? '')}</td>
								<td>{user.emailAddress}</td>
								<td>{user.admin ? 'Yes' : 'No'}</td>
								<td style={{width: 100, textAlign: 'right'}}>
									<AnchorButton
										icon='edit'
										minimal={true}
										href={`/users/${user.id}`}
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
