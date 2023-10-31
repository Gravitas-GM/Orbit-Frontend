import * as React from 'react';
import {Spacing} from '../../../../Styles/variables';
import {ValidationAwareFormGroup} from '../../../ValidationAwareFormGroup';
import {Button, ControlGroup, InputGroup, Intent, MenuItem, Radio, RadioGroup} from '@blueprintjs/core';
import {ValidationFailures, isValidationFailureError} from '../../../../Api/errors/symfony';
import {QuestionTag, QuestionTagCreatePayload, QuestionTagModel} from '../../../../Api/Quiz/Models/QuestionTags';
import {MultiSelect} from '../../../Select/MultiSelect';
import {User} from '../../../../Api/Hub/Models/Users';
import {ItemRenderer} from '@blueprintjs/select';
import {toaster} from '../../../../toaster';
import {Prompt} from 'react-router';

interface IProps {
	tag?: QuestionTag;
	users: User[];
}

interface IState {
	validationFailures: ValidationFailures | null;
	processing: boolean;
	label: string;
	autoAssign: boolean;
	members: User[];
	dirty: boolean;
}

export class TagEditorForm extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			label: this.props.tag ? this.props.tag.label : '',
			members: [],
			autoAssign: this.props.tag ? this.props.tag.autoAssign : false,
			validationFailures: null,
			processing: false,
			dirty: false,
		};
	}

	public componentDidMount(): void {
		const selectedUsers: User[] = [];

		if (this.props.tag) {
			for (const member of this.props.tag.members) {
				const found = this.props.users.find(user => user.id === member.id);

				if (found) selectedUsers.push(found);
			}
		}

		this.setState({
			members: selectedUsers,
		});
	}

	public render() {
		return (
			<div>
				<form>
					<ControlGroup fill={true}>
						<ValidationAwareFormGroup
							labelFor="label"
							label="Tag Name"
							failures={this.state.validationFailures}
							style={{paddingRight: Spacing.Large}}
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
							label="Automatically assign to all users?"
							failures={this.state.validationFailures}
						>
							<RadioGroup
								onChange={this.onAutoAssignChange}
								selectedValue={+this.state.autoAssign}
								inline={true}
							>
								<Radio label="Yes" value={+true} />
								<Radio label="No" value={+false} />
							</RadioGroup>
						</ValidationAwareFormGroup>
					</ControlGroup>

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

				<Button
					intent={Intent.PRIMARY}
					text="Submit"
					onClick={this.onSubmitClick}
					loading={this.state.processing}
				/>

				<Prompt when={this.state.dirty} message="Are you sure you want to leave? You have unsaved changes." />
			</div>
		);
	}

	private onLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		label: event.currentTarget.value,
		dirty: true,
	});

	private onAutoAssignChange = (event: React.FormEvent<HTMLInputElement>) => this.setState({
		autoAssign: !!parseInt(event.currentTarget.value),
		dirty: true,
	});

	private onMemberSelectionChange = (user: User) => {
		if (this.state.members.includes(user)) {
			this.setState(state => ({
				members: state.members.filter(item => item !== user),
				dirty: true,
			}));
		} else {
			this.setState(state => ({
				members: [...state.members, user],
				dirty: true,
			}));
		}
	};

	private onMemberRemove = (target: User) => this.setState(state => ({
		members: state.members.filter(item => item.id !== target.id),
		dirty: true,
	}));

	private onSelectAllClick = () => this.setState({
		members: this.props.users,
		dirty: true,
	});

	private onSelectNoneClick = () => this.setState({
		members: [],
		dirty: true,
	});

	private onSubmitClick = async () => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		try {
			await this.onSave({
				label: this.state.label,
				autoAssign: this.state.autoAssign,
				members: this.state.autoAssign
					? this.props.users.map(item => item.id)
					: this.state.members.map(item => item.id),
			});
		} catch (error) {
			if (isValidationFailureError(error)) {
				toaster.showValidationFailedErrorMessage();

				this.setState({
					validationFailures: error.context.failures,
				});
			} else toaster.showUnhandledErrorMessage();

			return;
		} finally {
			this.setState({
				processing: false,
			});
		}

		this.setState({
			validationFailures: null,
			dirty: false,
		});
	};

	private onSave = async (tag: QuestionTagCreatePayload) => {
		if (this.props.tag) {
			await QuestionTagModel.update(this.props.tag.id, tag).then(r => r.data);

			toaster.success(`Tag "${this.props.tag.label}" updated successfully`);

			return;
		}

		const newTag = await QuestionTagModel.create(tag).then(r => r.data);

		toaster.success(`Tag "${newTag.label}" created successfully`);
	};

	private userRenderer: ItemRenderer<User> = (user, state) => {
		if (!state.modifiers.matchesPredicate)
			return null;

		return (
			<MenuItem
				roleStructure="listoption"
				selected={this.state.members.includes(user)}
				key={user.id}
				active={state.modifiers.active}
				disabled={state.modifiers.disabled}
				text={`${user.firstName} ${user.lastName}`}
				onClick={state.handleClick}
				onFocus={state.handleFocus}
			/>
		);
	};
}

const tagRenderer = (user: User) => {
	return `${user.firstName} ${user.lastName}`;
};
