import {HTMLTable} from '@blueprintjs/core';
import * as React from 'react';
import {NonIdealState} from '../../NonIdealState';
import {LinkButton} from '../../LinkButton';
import {QuestionTag} from '../../../Api/Quiz/Models/QuestionTags';

interface ITableProps {
	children?: React.ReactNode;
}

export const TagsTable: React.FC<ITableProps> = (props) => {
	if (React.Children.count(props.children) === 0) {
		return (
			<NonIdealState
				title="This user doesn't have any tags assigned"
				description="You can assign tags using the button below"
				action={<LinkButton text="Assign tag" to="/quiz/tags/new" />}
			/>
		);
	}

	return (
		<HTMLTable striped={true}>
			<thead>
				<tr>
					<th>Tag Name</th>
					<th style={{width: 20}}>&nbsp;</th>
				</tr>
			</thead>

			<tbody>{props.children}</tbody>
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

			<td>
				<LinkButton text="Edit" to={`/quiz/tags/${item.id}`} />
			</td>
		</tr>
	);
};
