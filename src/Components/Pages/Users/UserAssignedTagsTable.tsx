import {HTMLTable} from '@blueprintjs/core';
import * as React from 'react';
import {QuestionTag} from '../../../Api/Quiz/Models/QuestionTags';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {LinkButton} from '../../LinkButton';
import {NonIdealState} from '../../NonIdealState';

interface ITableProps {
	items: QuestionTag[] | null;
	children?: React.ReactNode;
}

export const TagsTable: React.FC<ITableProps> = ({items}) => {
	if (items === null)
		return <FrameLoadingSpinner />;
	else if (items.length === 0) {
		return (
			<NonIdealState
				title="This user doesn't have any tags assigned"
				description="You can assign tags here:"
				action={<LinkButton text="Assign Tags" to="/quiz/tags" />}
			/>
		);
	}

	return (
		<HTMLTable striped={true}>
			<thead>
				<tr>
					<th>Tag Name</th>
				</tr>
			</thead>

			<tbody>
				{items.map(item => <TagsTableRow key={item.id} item={item} />)}
			</tbody>
		</HTMLTable>
	);
};

interface IRowProps {
	item: QuestionTag;
}

export const TagsTableRow: React.FC<IRowProps> = ({item}) => {
	return (
		<tr>
			<td>{item.label}</td>
		</tr>
	);
};
