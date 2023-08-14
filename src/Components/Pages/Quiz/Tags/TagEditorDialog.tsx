import React from "react";
import { Dialog, Classes, InputGroup, Button, Intent, MenuItem } from "@blueprintjs/core";
import { MultiSelect2 as MultiSelect, ItemRenderer } from "@blueprintjs/select";
import { QuestionTag, QuestionTagCreatePayload } from "../../../../Api/Quiz/Models/QuestionTags";
import { Spacing } from "../../../../Styles/variables";
import { ucwords } from "../../../Utility/string";
import { ValidationAwareFormGroup } from "../../../ValidationAwareFormGroup";
import { ValidationFailures } from "../../../../Api/errors/symfony";
import { UserContext } from "../../../../Session";
import { User } from "../../../../Api/Hub/Models/Users";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	tag: QuestionTag | null;
	users: User[];
	onSubmit: (tag: QuestionTagCreatePayload) => Promise<void>;
	validationFailures: ValidationFailures | null,
}

interface IState {
	processing: boolean;
	hubUsers: User[];
	dialogTitle: TagEditorDialogTitle;
	tagName: string;
	tagUsers: User[];
	tag: QuestionTag | null;
}

enum TagEditorDialogTitle {
	ADD = "Add new Tag",
	EDIT = "Edit Tag",
}

export class TagEditorDialog extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		processing: false,
		hubUsers: this.props.users,
		tag: this.props.tag,
		dialogTitle: TagEditorDialogTitle.ADD,
		tagName: "",
		tagUsers: [],
	};

	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public async componentDidUpdate(prevProps: IProps) {
		if (this.props !== prevProps) {
			this.setState({
				tag: this.props.tag,
				tagUsers: this.props.users.filter(user => this.props.tag?.members.includes(user.id)),
				hubUsers: this.props.users,
				tagName: this.props.tag?.label ?? "",
				dialogTitle: this.props.tag ? TagEditorDialogTitle.EDIT : TagEditorDialogTitle.ADD,
			});
		}
	}

	public render() {
		return (
			<Dialog isOpen={this.props.isOpen} title={this.state.dialogTitle} onClose={this.onCloseClick} isCloseButtonShown={!this.state.processing}>
				<form className={Classes.DIALOG_BODY}>
					<ValidationAwareFormGroup labelFor="name" failures={this.props.validationFailures}>
						<InputGroup
							type="text"
							id="name"
							placeholder="Tag name"
							fill={true}
							autoFocus={true}
							style={{ marginBottom: Spacing.Large }}
							value={this.state.tagName}
							onChange={this.onChangeTagName}
						/>
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup labelFor="users" failures={this.props.validationFailures}>
						<MultiSelect
							tagInputProps={{
								inputProps: {
									id: "users",
								},
							}}
							fill={true}
							placeholder="Select users"
							items={this.state.hubUsers}
							selectedItems={this.state.tagUsers}
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
								onClick={this.onSubmitClick}
								loading={this.state.processing}
								disabled={this.state.tagUsers.length === 0}
							/>
						</div>
					</div>
				</form>
			</Dialog>
		)
	}

	private onChangeTagName = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		tagName: event.currentTarget.value
	});

	private onUserRemove = (user: User) => {
		this.setState({
			tagUsers: this.state.tagUsers.filter((u) => u.id !== user.id)
		});
	}

	private onSubmitClick = async () => {
		this.setState({
			processing: true,
		});

		const tag: QuestionTagCreatePayload = {
			label: this.state.tagName,
			members: this.state.tagUsers.map(user => user.id),
			accountId: this.context!.account.id,
		};

		await this.props.onSubmit(tag);

		this.setState({
			processing: false,
		});
	}

	private onClearFilterClick = () => this.setState({
		 tagUsers: []
	});

	private onCloseClick = () => {
		if (this.state.processing)
			return;

		this.setState({
			tagName: "",
			tagUsers: [],
		});

		this.props.onClose();
	}

	private selectUser = (user: User) => {
		if (this.state.tagUsers.find((u) => u.id === user.id))
			return;

		this.setState({
			tagUsers: [...this.state.tagUsers, user]
		});
	}
}

const selectItemRenderer: ItemRenderer<User> = (user, { handleClick, modifiers }) => {
	if (!modifiers.matchesPredicate) {
		return null;
	}

	const name = `${user.firstName} ${user.lastName}`;

	return <MenuItem active={modifiers.active} key={user.id} text={ucwords(name)} onClick={handleClick} />;
};

const tagRenderer = (user: User) => {
	const name = `${user.firstName} ${user.lastName}`;

	return ucwords(name);
};
