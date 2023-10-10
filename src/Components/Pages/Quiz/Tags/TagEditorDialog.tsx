import * as React from 'react';
import {Dialog, Classes, InputGroup, Button, Intent, Switch} from '@blueprintjs/core';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {ItemRenderer} from '@blueprintjs/select';
import {User} from '../../../../Api/Hub/Models/Users';
import {QuestionTag, QuestionTagCreatePayload} from '../../../../Api/Quiz/Models/QuestionTags';
import {MultiSelect} from '../../../Select/MultiSelect';
import {ValidationAwareFormGroup} from '../../../ValidationAwareFormGroup';
import {isValidationFailureError, ValidationFailures} from '../../../../Api/errors/symfony';
import {UserContext} from '../../../../Session';
import * as toaster from '../../../../Toaster';

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	tag: QuestionTag | null;
	users: User[];
	onSubmit: (tag: QuestionTagCreatePayload) => Promise<void>;
}

interface IState {
	processing: boolean;
	label: string;
	autoAssign: boolean;
	members: User[];
	validationFailures: ValidationFailures | null,
}

enum TagEditorDialogTitle {
	ADD = 'Add New Tag',
	EDIT = 'Edit Tag',
}

export class TagEditorDialog extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		processing: false,
		label: '',
		autoAssign: false,
		members: [],
		validationFailures: null,
	};

	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public async componentDidUpdate(prevProps: IProps) {
		if (this.props.tag !== prevProps.tag) {
			const selectedUsers: User[] = [];

			if (this.props.tag) {
				for (const member of this.props.tag.members) {
					const found = this.props.users.find(user => user.id === member.id);

					if (found)
						selectedUsers.push(found);
				}
			}

			this.setState({
				label: this.props.tag?.label ?? '',
				members: selectedUsers,
				autoAssign: this.props.tag?.autoAssign ?? false,
			});
		}
	}

	public render() {
		return (
			<Dialog
				canOutsideClickClose={false}
				isOpen={this.props.isOpen}
				title={this.props.tag ? TagEditorDialogTitle.EDIT : TagEditorDialogTitle.ADD}
				onClose={this.onCloseClick}
				isCloseButtonShown={!this.state.processing}
			>
				<form className={Classes.DIALOG_BODY}>
					<ValidationAwareFormGroup
						labelFor="label"
						label="Tag Name"
						failures={this.state.validationFailures}
					>
						<InputGroup
							name="label"
							fill={true}
							autoFocus={true}
							value={this.state.label}
							onChange={this.onLabelChange}
						/>
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup
						labelFor="autoAssign"
						failures={this.state.validationFailures}
					>
						<div className="settings-switch-container">
								<span>
									Automatically assign to all users?
								</span>

							<Switch
								checked={this.state.autoAssign}
								onChange={this.onAutoAssignChange}
								large={true}
							/>
						</div>
					</ValidationAwareFormGroup>

					{!this.state.autoAssign && (
						<ValidationAwareFormGroup
							labelFor="members"
							label="Select Users"
							failures={this.state.validationFailures}
						>
							<MultiSelect
								tagInputProps={{
									inputProps: {
										name: 'members',
									},
								}}
								fill={true}
								items={this.props.users}
								selectedItems={this.state.members}
								onItemSelect={this.onMemberSelectionChange}
								onRemove={this.onMemberRemove}
								onSelectAll={this.onSelectAllClick}
								onSelectNone={this.onSelectNoneClick}
								itemRenderer={this.userRenderer}
								tagRenderer={tagRenderer}
								noResults={<div>No results</div>}
							/>
						</ValidationAwareFormGroup>
					)}
				</form>

				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button text="Cancel" onClick={this.onCloseClick} disabled={this.state.processing} />

						<Button
							intent={Intent.PRIMARY}
							text="Submit"
							onClick={this.onSubmitClick}
							loading={this.state.processing}
						/>
					</div>
				</div>
			</Dialog>
		);
	}

	private onLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		label: event.currentTarget.value,
	});

	private onAutoAssignChange = () => {
		if (this.state.autoAssign) {
			this.setState({
				autoAssign: false,
			});
		} else {
			this.setState({
				autoAssign: true,
			});
		}
	};

	private onMemberSelectionChange = (user: User) => {
		if (this.state.members.includes(user)) {
			this.setState(state => (
				{
					members: state.members.filter(item => item !== user),
				}
			));
		} else {
			this.setState(state => (
				{
					members: [...state.members, user],
				}
			));
		}
	};

	private onMemberRemove = (target: User) => this.setState(state => (
		{
			members: state.members.filter(item => item.id !== target.id),
		}
	));

	private onSelectAllClick = () => this.setState({
		members: this.props.users,
	});

	private onSelectNoneClick = () => this.setState({
		members: [],
	});

	private onSubmitClick = async () => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		try {
			await this.props.onSubmit({
				label: this.state.label,
				autoAssign: this.state.autoAssign,
				members: this.state.autoAssign ? this.props.users.map(item => item.id)
					: this.state.members.map(item => item.id),
			});
		} catch (error) {
			if (isValidationFailureError(error)) {
				toaster.showValidationFailedErrorMessage();

				this.setState({
					validationFailures: error.context.failures,
				});
			} else
				toaster.showUnhandledErrorMessage();

			return;
		} finally {
			this.setState({
				processing: false,
			});
		}

		this.setState({
			validationFailures: null,
			label: '',
			members: [],
		});
	};

	private onCloseClick = () => {
		if (this.state.processing)
			return;

		this.setState({
			label: '',
			members: [],
			validationFailures: null,
		});

		this.props.onClose();
	};

	private userRenderer: ItemRenderer<User> = (user, props) => {
		if (!props.modifiers.matchesPredicate)
			return null;

		return (
			<MenuItem
				roleStructure="listoption"
				selected={this.state.members.includes(user)}
				key={user.id}
				active={props.modifiers.active}
				disabled={props.modifiers.disabled}
				text={`${user.firstName} ${user.lastName}`}
				onClick={props.handleClick}
				onFocus={props.handleFocus}
			/>
		);
	};
}

const tagRenderer = (user: User) => {
	return `${user.firstName} ${user.lastName}`;
};
