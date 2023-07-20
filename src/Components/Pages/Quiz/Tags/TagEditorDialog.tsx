import React from "react";
import { Dialog, Classes, InputGroup, Button, Intent, MenuItem } from "@blueprintjs/core";
import { MultiSelect2 as MultiSelect, ItemRenderer } from "@blueprintjs/select";
import { QuestionTag, QuestionTagCreatePayload, QuestionTagModel } from "../../../../Api/Quiz/Models/QuestionTags";
import { Spacing } from "../../../../Styles/variables";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { ucwords } from "../../../Utility/string";
import { ValidationAwareFormGroup } from "../../../ValidationAwareFormGroup";
import { ValidationFailures, isValidationFailureError } from "../../../../Api/errors/symfony";
import { User as QuizUser, UserModel as QuizUserModel } from "../../../../Api/Quiz/Models/Users";
import { UserContext } from "../../../../Session";
import * as toaster from "../../../../Toaster";

interface ITagEditorDialogProps {
	isOpen: boolean;
	onClose: () => void;
	tag: QuestionTag | null;
}

interface ITagEditorDialogState {
	processing: boolean;
	hubUsers: QuizUser[];
	dialogTitle: TagEditorDialogTitle;
	newTagName: string;
	selectedUsers: QuizUser[];
	failures: ValidationFailures | null;
}

enum TagEditorDialogTitle {
	ADD = "Add new Tag",
	EDIT = "Edit Tag",
}

export class TagEditorDialog extends React.PureComponent<ITagEditorDialogProps, ITagEditorDialogState> {
	public state: Readonly<ITagEditorDialogState> = {
		processing: false,
		hubUsers: [],
		dialogTitle: TagEditorDialogTitle.ADD,
		newTagName: "",
		selectedUsers: [],
		failures: null,
	};

	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public async componentDidMount() {
		this.setState({
			processing: true
		});

		if (this.props.tag) {
			const ids = this.props.tag.members.map((member) => member.id);

			const selectedUsers = this.state.hubUsers.filter((user) => ids.includes(user.id));

			this.setState({
				dialogTitle: TagEditorDialogTitle.EDIT,
				newTagName: this.props.tag.label,
				selectedUsers
			})
		} else {
			this.setState({
				dialogTitle: TagEditorDialogTitle.ADD,
				newTagName: "",
				selectedUsers: [],
			});
		}

		let hubUsers: QuizUser[] = [];

		try {
			hubUsers = await QuizUserModel.list().then((response) => response.data);

		} catch (err) {
			toaster.error("Error while fetching users");
		};

		this.setState({
			hubUsers,
			processing: false
		});
	}

	public componentDidUpdate(prevProps: ITagEditorDialogProps) {
		if (prevProps.tag !== this.props.tag) {
			if (this.props.tag) {
				this.setState({
					dialogTitle: TagEditorDialogTitle.EDIT,
					newTagName: this.props.tag.label,
					selectedUsers: this.props.tag.members,
				});
			} else {
				this.setState({
					dialogTitle: TagEditorDialogTitle.ADD,
					newTagName: "",
					selectedUsers: [],
				});
			}
		}
	}

	public render() {
		if (this.state.processing) {
			return (
				<Dialog isOpen={this.props.isOpen} title={this.state.dialogTitle} onClose={this.props.onClose}>
					<div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: Spacing.XLarge }}>
						<FrameLoadingSpinner />
					</div>
				</Dialog>
			);
		}

		return (
			<Dialog isOpen={this.props.isOpen} title={this.state.dialogTitle} onClose={this.onCloseClick} isCloseButtonShown={!this.state.processing}>
				<form className={Classes.DIALOG_BODY}>
					<ValidationAwareFormGroup labelFor="tag-name" failures={this.state.failures}>
						<InputGroup
							type="text"
							id="tag-name"
							placeholder="Tag name"
							fill={true}
							autoFocus={true}
							style={{ marginBottom: Spacing.Large }}
							value={this.state.newTagName}
							onChange={this.onChangeTagName}
						/>
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup labelFor="tag-users" failures={this.state.failures}>
						<MultiSelect
							tagInputProps={{
								inputProps: {
									id: "tag-users",
								},
							}}
							fill={true}
							placeholder="Select users"
							items={this.state.hubUsers}
							selectedItems={this.state.selectedUsers}
							onItemSelect={this.selectUser}
							onRemove={this.onUserRemove}
							itemRenderer={selectItemRenderer}
							tagRenderer={tagRenderer}
							noResults={<div>No results</div>}
							popoverProps={{ minimal: true }}
						/>
					</ValidationAwareFormGroup>

					<div style={{ paddingTop: Spacing.Medium }}>
						<Button
							small={true}
							minimal={true}
							text="Clear"
							icon="minus"
							onClick={this.onClearFilterClick}
						/>
					</div>

					<div className={Classes.DIALOG_FOOTER}>
						<div className={Classes.DIALOG_FOOTER_ACTIONS}>
							<Button text="Cancel" onClick={this.onCloseClick} disabled={this.state.processing} />

							<Button
								intent={Intent.PRIMARY}
								text="Submit"
								onClick={this.onSubmitTag}
								loading={this.state.processing}
								disabled={this.state.selectedUsers.length === 0}
							/>
						</div>
					</div>
				</form>
			</Dialog>
		)
	}

	private onChangeTagName = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ newTagName: event.currentTarget.value });

	private onUserRemove = (user: QuizUser) => {
		this.setState({ selectedUsers: this.state.selectedUsers.filter((u) => u.id !== user.id) });
	}

	private onClearFilterClick = () => this.setState({ selectedUsers: [] });

	private onSubmitTag = async () => {
		const questionTag: QuestionTagCreatePayload = {
			accountId: this.context!.id,
			label: ucwords(this.state.newTagName),
			// members: selectedUsers.map((user) => user.id), // this is expecting Quiz User array, not Hub User array, neither an array of ids.
			members: this.state.selectedUsers, // fix just to make it work
		};

		try {
			await QuestionTagModel.create(questionTag).then((response) => response.data);
		} catch (err) {
			if (isValidationFailureError(err)) {
				this.setState({failures: err.context.failures });
			} else {
				toaster.error("Failed to create tag");
			}
		}
	}

	private onCloseClick = () => {
		if (this.state.processing)
			return;

		this.setState({
			newTagName: "",
			selectedUsers: [],
		});

		this.props.onClose();
	}

	private selectUser = (user: QuizUser) => {
		if (this.state.selectedUsers.find((u) => u.id === user.id))
			return;

		this.setState({ selectedUsers: [...this.state.selectedUsers, user] });
	}
}

const selectItemRenderer: ItemRenderer<QuizUser> = (user, { handleClick, modifiers }) => {
	if (!modifiers.matchesPredicate) {
		return null;
	}

	const name = `${user.name}`;

	return <MenuItem active={modifiers.active} key={user.id} text={ucwords(name)} onClick={handleClick} />;
};

const tagRenderer = (user: QuizUser) => {
	const name = `${user.name}`;

	return ucwords(name);
};
