import { Dialog, Classes, InputGroup, Button, Intent, MenuItem } from "@blueprintjs/core";
import { MultiSelect2 as MultiSelect, ItemRenderer } from "@blueprintjs/select";
import { useState, useEffect, useCallback, useContext } from "react";
import { QuestionTag, QuestionTagCreatePayload, QuestionTagModel } from "../../../../Api/Quiz/Models/QuestionTags";
import { Spacing } from "../../../../Styles/variables";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { ucwords } from "../../../Utility/string";
import { ValidationAwareFormGroup } from "../../../ValidationAwareFormGroup";
import { ValidationFailures, isValidationFailureError } from "../../../../Api/errors/symfony";
import { UserModel, User } from "../../../../Api/Hub/Models/Users";
import * as toaster from "../../../../Toaster";
import { Id } from "../../../../Api";
import { UserContext } from "../../../../Session";


interface ITagEditorDialogProps {
	isOpen: boolean;
	onClose: () => void;
	tag: QuestionTag | null;
}

export const TagEditorDialog: React.FC<ITagEditorDialogProps> = ({isOpen, onClose, tag}) => {
	const User = useContext(UserContext);

	const [newTagName, setNewTagName] = useState("");
	const [processing, setProcessing] = useState(false);
	const [hubUsers, setHubUsers] = useState<User[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
	const [failures, setFailures] = useState<ValidationFailures | null>(null);

	useEffect(() => {
		setProcessing(true);

		UserModel.list()
			.then((({data}) => setHubUsers(data)))
			.catch((err) => { toaster.error('Error while fetching users'); })
			.finally(() => {
				if (tag) {
					setNewTagName(tag.label);

					const ids = tag.members.map((member) => member.id);

					const selectedUsers = filterByHubId(ids);

					setSelectedUsers(selectedUsers);
				}

				setProcessing(false);
			});
	}, []);

	const filterByHubId = useCallback((ids: Id[]) => {
		return hubUsers.filter((user) => ids.includes(user.id));
	}, [hubUsers]);

	const onUserRemove = useCallback((user: User) => setSelectedUsers(
		selectedUsers.filter((u) => u.id !== user.id)
	), [selectedUsers]);

	const onSubmitTag = useCallback(async () => {
		setProcessing(true);

		const questionTag: QuestionTagCreatePayload = {
			accountId: User!.id,
			label: ucwords(newTagName),
			members: selectedUsers.map((user) => user.id), // this is expecting Quiz User array, not Hub User array, neither an array of ids.
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
		if (processing)
			return;

		setNewTagName("");

		setSelectedUsers([]);

		onClose();
	}, [onClose, processing]);

	const selectUser = useCallback((user: User) => {
		if (selectedUsers.find((u) => u.id === user.id))
			return;

		setSelectedUsers([...selectedUsers, user]);
	}, [selectedUsers]);

	if (processing) {
		return (
			<Dialog isOpen={isOpen} title="Add New Tag" onClose={onClose}>
				<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 120 }}>
					<FrameLoadingSpinner />
				</div>
			</Dialog>
		);
	}

	return (
		<Dialog isOpen={isOpen} title="Add New Tag" onClose={onCloseClick}  isCloseButtonShown={!processing}>
			<form className={Classes.DIALOG_BODY}>
				<ValidationAwareFormGroup labelFor="tag-name" failures={failures}>
					<InputGroup
						type="text"
						id="tag-name"
						placeholder="Tag name"
						fill={true}
						autoFocus={true}
						style={{ marginBottom: Spacing.l }}
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

				<div style={{ paddingTop: Spacing.m }}>
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
}

const selectItemRenderer: ItemRenderer<User> = (user, { handleClick, modifiers}) => {
	if (!modifiers.matchesPredicate) {
		return null;
	}
	const name = `${user.firstName} ${user.lastName}`;

	return (
		<MenuItem
			active={modifiers.active}
			key={user.id}
			text={ucwords(name)}
			onClick={handleClick}
		/>
	);
};

const tagRenderer = (user: User) => {
	const name = `${user.firstName} ${user.lastName}`;

	return ucwords(name);
}
