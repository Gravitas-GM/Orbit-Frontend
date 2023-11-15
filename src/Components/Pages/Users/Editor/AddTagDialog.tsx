import * as React from 'react';
import {ItemRenderer} from '@blueprintjs/select';
import {Button, Classes, Dialog, FormGroup, Intent} from '@blueprintjs/core';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {QuestionTag} from '../../../../Api/Quiz/Models/QuestionTags';
import {Select} from '../../../Select/Select';

interface IProps {
	tags: QuestionTag[];
	processing: boolean;
	onClose: () => void;
	onSubmit: (questionTag: QuestionTag) => void;
}

export const AddTagDialog: React.FC<IProps> = props => {
	const [selectedTag, setSelectedTag] = React.useState<QuestionTag | null>();

	return (
		<Dialog
			onClose={props.onClose}
			isOpen={true}
			title="Add Tag"
		>
			<div className={Classes.DIALOG_BODY}>
				<FormGroup
					label="Assign Tag to this User"
					labelFor="selectedTag"
				>
					<Select
						items={props.tags}
						onItemSelect={setSelectedTag}
						filterable={false}
						itemRenderer={renderTag}
						fill={true}
						noResults={(
							<MenuItem
								disabled={true}
								text="No results"
								roleStructure="listoption"
							/>
						)}
					>
						<Button
							fill={true}
							text={selectedTag ? selectedTag.label : 'Select a Tag'}
							rightIcon="caret-down"
							alignText="left"
							placeholder="Select a Tag"
						/>
					</Select>
				</FormGroup>
			</div>

			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button
						text="Cancel"
						onClick={props.onClose}
						disabled={props.processing}
					/>

					<Button
						intent={Intent.PRIMARY}
						text="Submit"
						disabled={selectedTag === null}
						onClick={() => props.onSubmit(selectedTag!)}
						loading={props.processing}
					/>
				</div>
			</div>
		</Dialog>
	);
}

const renderTag: ItemRenderer<QuestionTag> = (tag, {handleClick, handleFocus, modifiers}) => {
	if (!modifiers.matchesPredicate)
		return null;

	return (
		<MenuItem
			active={modifiers.active}
			disabled={modifiers.disabled}
			key={tag.id}
			onClick={handleClick}
			onFocus={handleFocus}
			roleStructure="listoption"
			text={tag.label}
		/>
	);
};
