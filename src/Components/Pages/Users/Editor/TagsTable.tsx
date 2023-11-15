import * as React from 'react';
import {Button, Checkbox, HTMLTable, Intent} from '@blueprintjs/core';
import {QuestionTag} from '../../../../Api/Quiz/Models/QuestionTags';
import {Spacing} from '../../../../Styles/variables';
import {NonIdealState} from '../../../NonIdealState';
import {ucwords} from '../../../Utility/string';

interface ITableProps {
	onAddTagClick: () => void;
	onSelectAll: () => void;
	allSelected: boolean;
	children?: React.ReactNode;
}

export const TagsTable: React.FC<ITableProps> = props => {
	if (React.Children.count(props.children) === 0) {
		return (
			<NonIdealState
				title="This user doesn't have any tags assigned"
				description="You can start assigning tags using the button below"
				action={(
					<Button
						icon="plus"
						text="Add Tag"
						onClick={props.onAddTagClick}
						outlined={true}
						intent={Intent.PRIMARY}
					/>
				)}
			/>
		);
	}

	return (
		<HTMLTable striped={true}>
			<thead>
				<tr>
					<th style={{width: Spacing.XLarge}}>
						<Checkbox checked={props.allSelected} onClick={props.onSelectAll} />
					</th>

					<th>Label</th>
					<th style={{width: 100, textAlign: 'center'}}>Delete</th>
				</tr>
			</thead>

			<tbody>
				{props.children}
			</tbody>
		</HTMLTable>
	);
};

interface IRowProps {
	item: QuestionTag;
	onDelete: (items: QuestionTag) => void;
	isChecked: boolean;
	onSelect: (item: QuestionTag) => void;
	loading?: boolean;
}

export const TagsTableRow: React.FC<IRowProps> = ({item, loading, isChecked, onDelete, onSelect}) => {
	const onDeleteClick = React.useCallback(() => onDelete(item), [onDelete, item]);
	const onCheckboxClick = React.useCallback(() => onSelect(item), [onSelect, item]);

	return (
		<tr>
			<td><Checkbox checked={isChecked} onClick={onCheckboxClick} /></td>
			<td>{ucwords(item.label)}</td>
			<td style={{textAlign: 'center'}}>
				<Button
					icon="delete"
					minimal={true}
					intent={Intent.DANGER}
					loading={loading}
					onClick={onDeleteClick}
				/>
			</td>
		</tr>
	);
};
