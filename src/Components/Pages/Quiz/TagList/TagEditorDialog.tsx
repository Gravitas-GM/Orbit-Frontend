import { Dialog, Classes, InputGroup, Button, Intent, MenuItem } from "@blueprintjs/core";
import { MultiSelect2, ItemRenderer } from "@blueprintjs/select";
import { useState, useEffect, useCallback } from "react";
import { QuestionTag, User } from ".";
import { Spacing } from "../../../../Styles/variables";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { ucwords } from "../../../Utility/string";

interface ITagEditorDialogProps {
	isOpen: boolean;
	onClose: () => void;
	tag: QuestionTag | null;
}

export const TagEditorDialog: React.FC<ITagEditorDialogProps> = ({isOpen, onClose, tag}) => {
	const [newTagName, setNewTagName] = useState("");
	const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
	const [processing, setProcessing] = useState(false);

	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		if (tag) {
			setNewTagName(tag.label);
			setSelectedUsers(tag.members);
		}

		setProcessing(true);

		const fetchUsers = async () => {
			let users: User[] = [];

			setTimeout(() => {
				users = [
					{
						assignedTags: [],
						id: 1,
						name: "John Doe",
						nextQuizTimestamp: new Date(),
					},
					{
						assignedTags: [],
						id: 2,
						name: "Jane Datsun",
						nextQuizTimestamp: new Date()
					},
					{
						assignedTags: [],
						id: 3,
						name: "Rupert Holmes",
						nextQuizTimestamp: new Date()
					}
				];

				setUsers(users);

				setProcessing(false);
			}, 3000);
		};

		fetchUsers();
	}, [tag, isOpen]);

	const onUserRemove = useCallback((user: User) => setSelectedUsers(
		selectedUsers.filter((u) => u.id !== user.id)
	), [selectedUsers]);

	const onSubmitTag = useCallback(() => {
		setProcessing(true);
		setTimeout(() => {
			console.log("Submitted tag", newTagName, selectedUsers);
			setProcessing(false);
			onClose();
		}, 3000);
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
				<InputGroup
					type="text"
					placeholder="Tag name"
					fill={true}
					autoFocus={true}
					style={{ marginBottom: Spacing.l }}
					value={newTagName}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewTagName(event.currentTarget.value)}
				/>

				<MultiSelect2
					fill={true}
					placeholder="Select users"
					items={users}
					selectedItems={selectedUsers}
					onItemSelect={selectUser}
					onRemove={onUserRemove}
					itemRenderer={selectItemRenderer}
					tagRenderer={tagRenderer}
					noResults={<div>No results</div>}
					tagInputProps={{ onRemove: () => {} }}
					popoverProps={{ minimal: true }}
				/>

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

	return (
		<MenuItem
			active={modifiers.active}
			key={user.id}
			text={ucwords(user.name)}
			onClick={handleClick}
		/>
	);
};

const tagRenderer = (user: User) => {
	return ucwords(user.name);
}