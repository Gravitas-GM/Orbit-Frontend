import {Button, HTMLTable, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {User, UserModel} from '../../../../Api/Hub/Models/Users';
import {Classes} from '../../../../classes';
import {Permission} from '../../../../Permission';
import {toaster} from '../../../../toaster';
import {DeleteDialog} from '../../../DeleteDialog';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {PageHeader} from '../../../PageHeader';
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
				<PageHeader title="Users" />

				<HTMLTable striped={true}>
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Admin</th>
							<th style={{textAlign: 'center', width: 100}}>Edit</th>
							<th style={{width: 100, textAlign: 'center'}}>Delete</th>
						</tr>
					</thead>

					<tbody>
						{this.state.users.map(user => (
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

				<DeleteDialog
					isOpen={this.state.deleteTarget !== null}
					subject={renderUserName(this.state.deleteTarget)}
					onConfirm={this.onDeleteConfirm}
					onCancel={this.onDeleteCancel}
				/>
			</div>
		);
	}

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
