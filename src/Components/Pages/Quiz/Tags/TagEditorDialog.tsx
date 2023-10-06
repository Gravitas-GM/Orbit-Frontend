import * as React from 'react';
import {Dialog, Classes, InputGroup, Button, Intent} from '@blueprintjs/core';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {ItemRenderer} from '@blueprintjs/select';
import {User} from '../../../../Api/Hub/Models/Users';
import {Question} from '../../../../Api/Quiz/Models/Questions';
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
	questions: Question[];
	onSubmit: (tag: QuestionTagCreatePayload) => Promise<void>;
}

interface IState {
	processing: boolean;
	label: string;
	members: User[];
	selectedQuestions: Question[];
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
		members: [],
		selectedQuestions: [],
		validationFailures: null,
	};

	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public async componentDidUpdate(prevProps: IProps) {
		if (this.props.tag !== prevProps.tag) {
			const selectedUsers: User[] = [];
			const selectedQuestions: Question[] = [];

			if (this.props.tag) {
				for (const member of this.props.tag.members) {
					const found = this.props.users.find(user => user.id === member.id);

					if (found)
						selectedUsers.push(found);
				}

				for (const question of this.props.tag.questions) {
					const found = this.props.questions.find(q => q.id === question.id);

					if (found)
						selectedQuestions.push(found);
				}
			}

			this.setState({
				label: this.props.tag?.label ?? '',
				members: selectedUsers,
				selectedQuestions,
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
							onSelectAll={this.onSelectAllMembersClick}
							onSelectNone={this.onSelectNoneMembersClick}
							itemRenderer={this.userRenderer}
							tagRenderer={userTagRenderer}
							noResults={<div>No results</div>}
						/>
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup
						labelFor="questions"
						label="Assign Tag to Questions"
						failures={this.state.validationFailures}
					>
						<MultiSelect
							tagInputProps={{
								inputProps: {
									name: 'questions',
								},
							}}
							fill={true}
							items={this.props.questions}
							selectedItems={this.state.selectedQuestions}
							onItemSelect={this.onQuestionSelectionChange}
							onRemove={this.onQuestionRemove}
							onSelectAll={this.onSelectAllQuestionsClick}
							onSelectNone={this.onSelectNoneQuestionsClick}
							itemRenderer={this.questionRenderer}
							tagRenderer={questionTagRenderer}
							noResults={<div>No results</div>}
						/>
					</ValidationAwareFormGroup>
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

	private onSelectAllMembersClick = () => this.setState({
		members: this.props.users,
	});

	private onSelectNoneMembersClick = () => this.setState({
		members: [],
	});

	private onQuestionSelectionChange = (question: Question) => {
		if (this.state.selectedQuestions.includes(question)) {
			this.setState(state => (
				{
					selectedQuestions: state.selectedQuestions.filter(item => item !== question),
				}
			));
		} else {
			this.setState(state => (
				{
					selectedQuestions: [...state.selectedQuestions, question],
				}
			));
		}
	};

	private onQuestionRemove = (target: Question) => this.setState(state => (
		{
			selectedQuestions: state.selectedQuestions.filter(item => item.id !== target.id),
		}
	));

	private onSelectAllQuestionsClick = () => this.setState({
		selectedQuestions: this.props.questions,
	});

	private onSelectNoneQuestionsClick = () => this.setState({
		selectedQuestions: [],
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
				members: this.state.members.map(item => item.id),
				questions: this.state.selectedQuestions.map(item => item.id),
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

	private questionRenderer: ItemRenderer<Question> = (question, props) => {
		if (!props.modifiers.matchesPredicate)
			return null;

		return (
			<MenuItem
				roleStructure="listoption"
				selected={this.state.selectedQuestions.includes(question)}
				key={question.id}
				active={props.modifiers.active}
				disabled={props.modifiers.disabled}
				text={question.prompt}
				onClick={props.handleClick}
				onFocus={props.handleFocus}
			/>
		);
	};
}

const userTagRenderer = (user: User) => {
	return `${user.firstName} ${user.lastName}`;
};

const questionTagRenderer = (question: Question) => {
	return question.prompt;
};
