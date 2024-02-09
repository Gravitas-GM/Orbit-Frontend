import * as React from 'react';
import {Button, HTMLTable, Intent} from '@blueprintjs/core';
import {User, UserModel} from '../../../../Api/Hub/Models/Users';
import {Classes} from '../../../../classes';
import {Permission} from '../../../../Permission';
import {Spacing} from '../../../../Styles/variables';
import {toaster} from '../../../../toaster';
import {DeleteDialog} from '../../../DeleteDialog';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {ObjectList} from '../../../ObjectList';
import {compareStrings, renderUserName} from '../../../Utility/string';
import {LinkButton} from '../../../LinkButton';

interface IState {
	users: User[];
	loading: boolean;
	processing: boolean;
	deleteTarget: User | null;
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
		processing: false,
		deleteTarget: null,
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
			<div className={Classes.PAGE_WRAPPER}>
				<ObjectList
					items={this.state.users}
					title="Users"
					onItemFilter={this.onItemFilter}
				>
					{items => (
						<HTMLTable striped={true}>
							<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
									<th>Admin</th>
									<th style={{textAlign: 'center', width: Spacing.XXLarge}}>Edit</th>
									<th style={{textAlign: 'center', width: Spacing.XXLarge}}>Delete</th>
								</tr>
							</thead>

							<tbody>
								{items.map(user => (
									<tr key={`user-${user.id}`}>
										<td>{renderUserName(user)}</td>
										<td>{user.emailAddress}</td>
										<td>{user.permissions.includes(Permission.ADMIN) ? 'Yes' : 'No'}</td>
										<td style={{textAlign: 'center'}}>
											<LinkButton
												icon="edit"
												minimal={true}
												to={`/users/${user.id}`}
											/>
										</td>
										<td style={{textAlign: 'center'}}>
											<Button
												icon="delete"
												minimal={true}
												intent={Intent.DANGER}
												loading={this.state.processing}
												onClick={() => this.onBeginDeleteButtonClick(user)}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</HTMLTable>
					)}
				</ObjectList>

				<DeleteDialog
					isOpen={this.state.deleteTarget !== null}
					subject={renderUserName(this.state.deleteTarget)}
					onConfirm={this.onDeleteConfirm}
					onCancel={this.onDeleteCancel}
				/>
			</div>
		);
	}

	private onItemFilter = (user: User, searchText: string) =>
		renderUserName(user).toLocaleLowerCase().includes(searchText);

	private onBeginDeleteButtonClick = (item: User) => this.setState({
		deleteTarget: item,
	});

	private onDeleteCancel = () => this.setState({
		deleteTarget: null,
	});

	private onDeleteConfirm = async () => {
		if (this.state.processing)
			return;

		if (!this.state.deleteTarget)
			return;

		this.setState({
			processing: true,
		});

		try {
			await UserModel.delete(this.state.deleteTarget.id);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				processing: false,
			});

			return;
		}

		this.setState(state => ({
			users: state.users.filter(item => item !== this.state.deleteTarget),
			deleteTarget: null,
			processing: false,
		}));
	};
}
