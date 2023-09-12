import * as React from 'react';
import {HTMLTable, Button, AnchorButton} from '@blueprintjs/core';
import {Question} from '../../../../Api/Quiz/Models/Questions';
import {NonIdealState} from '../../../NonIdealState';

interface IProps {
	items: Question[],
	deleteCallback: (question: Question) => void,
}

export const RenderPageItems: React.FC<IProps> = ({items, deleteCallback}) => {
	if (items.length === 0)
		return <NonIdealState title="No questions found" />;

	return (
		<HTMLTable striped={true}>
			<thead>
				<tr>
					<th>Prompt</th>
					<th>Tag</th>
					<th>Actions</th>
				</tr>
			</thead>

			<tbody>
			{items.map(question => (
				<tr key={question.id}>
					<td>{question.prompt}</td>

					{/*TODO: This should be the tag name, but will require a model update to do so -Larry*/}
					<td style={{width: 240}}>{question.tag ? question.tag.id : '—'}</td>

					<td style={{width: 80}}>
						<div style={{display: 'flex', justifyContent: 'space-between'}}>
							<AnchorButton icon="edit" minimal={true} href={`/quiz/questions/${question.id}`} />

							<Button icon="trash" minimal={true} onClick={() => deleteCallback(question)} />
						</div>
					</td>
				</tr>
			))}
			</tbody>
		</HTMLTable>
	);
};
