import * as React from 'react';
import {ControlGroup, InputGroup, MenuItem, Radio, RadioGroup} from '@blueprintjs/core';
import {ItemRenderer} from '@blueprintjs/select';
import {isValidationFailureError, ValidationFailures} from '../../../../Api/errors/symfony';
import {User, UserModel} from '../../../../Api/Hub/Models/Users';
import {QuestionTag, QuestionTagCreatePayload, QuestionTagModel} from '../../../../Api/Quiz/Models/QuestionTags';
import {Spacing} from '../../../../Styles/variables';
import {PageHeader} from '../../../PageHeader';
import {toaster} from '../../../../toaster';
import {Prompt, Redirect, RouteComponentProps} from 'react-router';
import {MultiSelect} from '../../../Select/MultiSelect';
import {ValidationAwareFormGroup} from '../../../ValidationAwareFormGroup';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {FormControls} from '../../../FormControls';

interface IState {
	loading: boolean;
	users: User[];
	redirect: boolean;
	validationFailures: ValidationFailures | null;
	processing: boolean;
	label: string;
	autoAssign: boolean;
	members: User[];
	dirty: boolean;
}

interface IRouteProps {
	tag?: string;
}

enum TagEditorPageTitle {
	ADD = 'Add New Tag',
	EDIT = 'Edit Tag',
}

export class TagEditor extends React.PureComponent<RouteComponentProps<IRouteProps>, IState> {
	public state: Readonly<IState> = {
		loading: true,
		users: [],
		redirect: false,
		label: '',
		members: [],
		autoAssign: false,
		validationFailures: null,
		processing: false,
		dirty: false,
	};

	public async componentDidMount() {
		let users: User[] = [];

		try {
			users = await UserModel.list().then(response => response.data);
		} catch (error) {
			toaster.error('Could not load Users.');

			this.setState({
				redirect: true,
			});

			return;
		}

		const idParam = this.props.match.params.tag;

		if (!idParam) {
			this.setState({
				users,
				loading: false,
			});

			return;
		}

		let tag: QuestionTag;

		try {
			tag = await QuestionTagModel.read(idParam).then(response => response.data);
		} catch (error) {
			toaster.error('Could not find specified Tag.');

			this.setState({
				redirect: true,
			});

			return;
		}

		const members: User[] = [];

		for (const member of tag.members) {
			const found = users.find(user => user.id === member.id);

			if (found) members.push(found);
		}

		this.setState({
			users,
			members,
			autoAssign: tag.autoAssign,
			label: tag.label,
			loading: false,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;
		else if (this.state.redirect)
			return <Redirect to="/quiz/tags" />;

		return (
			<section className="gm-page-wrapper">
				<PageHeader title={this.props.match.params.tag ? TagEditorPageTitle.EDIT : TagEditorPageTitle.ADD} />

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
							label="Automatically assign to new users?"
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
							items={this.state.users}
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

					<FormControls
						onSaveClick={this.onSaveClick}
						loading={this.state.loading}
						dirty={this.state.dirty}
						redirectPath="/quiz/tags"
					/>
				</form>
			</section>
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
		members: this.state.users,
		dirty: true,
	});

	private onSelectNoneClick = () => this.setState({
		members: [],
		dirty: true,
	});

	private onSaveClick = async () => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		try {
			await this.saveTag({
				label: this.state.label,
				autoAssign: this.state.autoAssign,
				members: this.state.members.map(item => item.id),
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
			redirect: true,
		});
	};

	private saveTag = async (tag: QuestionTagCreatePayload) => {
		if (this.props.match.params.tag) {
			await QuestionTagModel.update(this.props.match.params.tag, tag);

			toaster.success(`Tag "${this.state.label}" updated successfully`);

			return;
		}

		await QuestionTagModel.create(tag);

		toaster.success(`Tag "${this.state.label}" created successfully`);
	};

	private userRenderer: ItemRenderer<User> = (user, state) => {
		if (!state.modifiers.matchesPredicate)
			return null;

		const selected = this.state.members.includes(user);

		return (
			<MenuItem
				roleStructure="listoption"
				key={user.id}
				active={state.modifiers.active}
				disabled={state.modifiers.disabled}
				text={`${user.firstName} ${user.lastName}`}
				onClick={state.handleClick}
				onFocus={state.handleFocus}
				icon={selected ? 'small-tick' : 'blank'}
			/>
		);
	};
}

const tagRenderer = (user: User) => {
	return `${user.firstName} ${user.lastName}`;
};
