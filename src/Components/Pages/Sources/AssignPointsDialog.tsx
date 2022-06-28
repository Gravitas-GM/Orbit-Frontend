import {Button, Classes, Dialog, FormGroup, Intent, MenuItem} from '@blueprintjs/core';
import {ItemRenderer, MultiSelect} from '@blueprintjs/select';
import * as React from 'react';
import {User, UserModel} from '../../../Api/Hub/Models/Users';
import {PointsModel} from '../../../Api/Point-Tracking/Models/Points';
import {PointSourceItem} from '../../../Api/Point-Tracking/Models/Sources';
import * as toaster from '../../../Toaster';
import {allSettled} from '../../Utility/promise';
import {compareStrings, renderUserName, ucwords} from '../../Utility/string';

interface IProps {
	source: PointSourceItem;
	onClose: () => void;
}

interface IState {
	loading: boolean;
	processing: boolean;
	users: User[];
	selectedUsers: User[];
}

function sortUsers(a: User, b: User) {
	const compare = compareStrings(a.lastName ?? '', b.lastName ?? '');

	if (compare !== 0)
		return compare;

	return compareStrings(a.firstName ?? '', b.firstName ?? '');
}

export class AssignPointsDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			loading: true,
			processing: false,
			users: [],
			selectedUsers: [],
		};
	}

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
		return (
			<Dialog onClose={this.props.onClose} isOpen={true} title="Assign Points">
				<div className={Classes.DIALOG_BODY}>
					<form>
						<FormGroup
							label="Select Users"
							labelFor="selectedUsers"
						>
							<MultiSelect
								selectedItems={this.state.selectedUsers}
								items={this.state.users}
								onItemSelect={this.onUserSelect}
								onRemove={this.onUserRemove}
								tagRenderer={renderUserName}
								itemRenderer={this.selectItemRenderer}
							/>
						</FormGroup>
					</form>
				</div>

				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button text="Cancel" onClick={this.props.onClose} disabled={this.state.processing} />

						<Button
							intent={Intent.PRIMARY}
							text="Submit"
							onClick={this.onSubmit}
							loading={this.state.processing}
						/>
					</div>
				</div>
			</Dialog>
		);
	}

	private onUserSelect = (user: User) => this.setState(state => ({
		selectedUsers: [...state.selectedUsers, user],
	}));

	private onUserRemove = (user: User) => this.setState(state => ({
		selectedUsers: state.selectedUsers.filter(item => item !== user),
	}));

	private onSubmit = async (event: React.SyntheticEvent<any>) => {
		event.preventDefault();

		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		const failed: User[] = [];

		try {
			await allSettled(this.state.selectedUsers.map(async user => {
				try {
					await PointsModel.create(user.id, {
						timestamp: new Date(),
						point_value: this.props.source.point_value,
						source: this.props.source.name,
					});
				} catch (error) {
					failed.push(user);

					throw error;
				}
			}));
		} catch (_) {
			toaster.error(`Failed giving ${failed.length} of the selected Users points.`);

			this.setState({
				processing: false,
			});

			this.props.onClose();

			return;
		}

		toaster.success(
			'Assigned points to selected users.',
		);

		this.setState({
			processing: false,
		});

		this.props.onClose();
	};

	private selectItemRenderer: ItemRenderer<User> = (item, { handleClick, modifiers}) => {
		if (!modifiers.matchesPredicate) {
			return null;
		}

		return (
			<MenuItem
				active={modifiers.active}
				key={`selectItem-${item.id}`}
				text={renderUserName(item)}
				onClick={handleClick}
			/>
		);
	};
}
