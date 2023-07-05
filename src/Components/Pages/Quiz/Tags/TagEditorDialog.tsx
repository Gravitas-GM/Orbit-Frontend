import { Dialog, Classes, InputGroup, Button, Intent, MenuItem } from "@blueprintjs/core";
import { MultiSelect2 as MultiSelect, ItemRenderer } from "@blueprintjs/select";
import { useState, useEffect, useCallback, useContext } from "react";
import { QuestionTag, QuestionTagCreatePayload, QuestionTagModel } from "../../../../Api/Quiz/Models/QuestionTags";
import { Spacing } from "../../../../Styles/variables";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { ucwords } from "../../../Utility/string";
import { ValidationAwareFormGroup } from "../../../ValidationAwareFormGroup";
import { ValidationFailures, isValidationFailureError } from "../../../../Api/errors/symfony";
import { User as QuizUser, UserModel as QuizUserModel } from "../../../../Api/Quiz/Models/Users";
import * as toaster from "../../../../Toaster";
import { Id } from "../../../../Api";
import { UserContext } from "../../../../Session";

interface ITagEditorDialogProps {
	isOpen: boolean;
	onClose: () => void;
	tag: QuestionTag | null;
}

enum TagEditorDialogModeTitle {
	ADD = "Add new Tag",
	EDIT = "Edit Tag",
}

export const TagEditorDialog: React.FC<ITagEditorDialogProps> = ({ isOpen, onClose, tag }) => {
	const User = useContext(UserContext);

	const [newTagName, setNewTagName] = useState("");
	const [dialogTitle, setDialogTitle] = useState<TagEditorDialogModeTitle>(TagEditorDialogModeTitle.ADD);
	const [processing, setProcessing] = useState(false);
	const [hubUsers, setHubUsers] = useState<QuizUser[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<QuizUser[]>([]);
	const [failures, setFailures] = useState<ValidationFailures | null>(null);

	useEffect(() => {
		if (tag) {
			setDialogTitle(TagEditorDialogModeTitle.EDIT);

			setNewTagName(tag.label);

			const ids = tag.members.map((member) => member.id);

			const selectedUsers = filterByHubId(ids);

			setSelectedUsers(selectedUsers);
		} else {
			setDialogTitle(TagEditorDialogModeTitle.ADD);

			setNewTagName("");

			setSelectedUsers([]);
		}

		setProcessing(true);

		QuizUserModel.list()
			.then((response) => setHubUsers(response.data))
			.then(() => setProcessing(false))
			.catch((err) => {
				toaster.error("Error while fetching users");
			});

		setProcessing(false);
	}, [tag, isOpen]);

	const filterByHubId = useCallback(
		(ids: Id[]) => {
			return hubUsers.filter((user) => ids.includes(user.id));
		},
		[hubUsers]
	);

	const onUserRemove = useCallback(
		(user: QuizUser) => setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id)),
		[selectedUsers]
	);

	const onSubmitTag = useCallback(async () => {
		setProcessing(true);

		const questionTag: QuestionTagCreatePayload = {
			accountId: User!.id,
			label: ucwords(newTagName),
			// members: selectedUsers.map((user) => user.id), // this is expecting Quiz User array, not Hub User array, neither an array of ids.
			members: selectedUsers, // fix just to make it work
		};

		try {
			await QuestionTagModel.create(questionTag).then((response) => response.data);
		} catch (err) {
			if (isValidationFailureError(err)) {
				setFailures(err.context.failures);
			} else {
				toaster.error("Failed to create tag");
			}
		}

		setProcessing(false);
	}, [onClose, newTagName, selectedUsers]);

	const onCloseClick = useCallback(() => {
		if (processing) return;

		setNewTagName("");

		setSelectedUsers([]);

		onClose();
	}, [onClose, processing]);

	const selectUser = useCallback(
		(user: QuizUser) => {
			if (selectedUsers.find((u) => u.id === user.id))
				return;

			setSelectedUsers([...selectedUsers, user]);
		},
		[selectedUsers]
	);

	if (processing) {
		return (
			<Dialog isOpen={isOpen} title={dialogTitle} onClose={onClose}>
				<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 120 }}>
					<FrameLoadingSpinner />
				</div>
			</Dialog>
		);
	}

	return (
		<Dialog isOpen={isOpen} title={dialogTitle} onClose={onCloseClick} isCloseButtonShown={!processing}>
			<form className={Classes.DIALOG_BODY}>
				<ValidationAwareFormGroup labelFor="tag-name" failures={failures}>
					<InputGroup
						type="text"
						id="tag-name"
						placeholder="Tag name"
						fill={true}
						autoFocus={true}
						style={{ marginBottom: Spacing.Large }}
						value={newTagName}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewTagName(event.currentTarget.value)}
					/>
				</ValidationAwareFormGroup>

				<ValidationAwareFormGroup labelFor="tag-users" failures={failures}>
					<MultiSelect
						tagInputProps={{
							inputProps: {
								id: "tag-users",
							},
						}}
						fill={true}
						placeholder="Select users"
						items={hubUsers}
						selectedItems={selectedUsers}
						onItemSelect={selectUser}
						onRemove={onUserRemove}
						itemRenderer={selectItemRenderer}
						tagRenderer={tagRenderer}
						noResults={<div>No results</div>}
						popoverProps={{ minimal: true }}
					/>
				</ValidationAwareFormGroup>

				<div style={{ paddingTop: Spacing.Medium }}>
					<Button small={true} minimal={true} text="Clear" icon="minus" onClick={() => setSelectedUsers([])} />
				</div>

				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button text="Cancel" onClick={onCloseClick} disabled={processing} />

						<Button
							intent={Intent.PRIMARY}
							text="Submit"
							onClick={onSubmitTag}
							loading={processing}
							disabled={selectedUsers.length === 0}
						/>
					</div>
				</div>
			</form>
		</Dialog>
	);
};

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
