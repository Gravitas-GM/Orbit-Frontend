import * as React from 'react';
import { Button, Intent } from "@blueprintjs/core";
import { useMemo } from "react";
import { QuizSubmission } from "../../../../Api/Quiz/Models/QuizSubmissions";
import {formatDate} from '../../../Utility/date';

interface IRenderHistoryItemsProps {
	items: QuizSubmission[];

	handleClick: (index: number) => void;
}

export const RenderHistoryItems: React.FC<IRenderHistoryItemsProps> = ({ items, handleClick }) => {
	const sortedItems = useMemo(
		() => items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
		[items]
	);

	return (
		<tbody>
			{sortedItems.map((item, index) => (
				<tr key={`${item.user.id} ${item.timestamp}`}>
					<td>{item.user.name}</td>

					<td>{item.correctCount}/{item.questions.length}</td>

					<td>{formatDate(item.timestamp)}</td>

					<td>
						<Button intent={Intent.PRIMARY} onClick={() => handleClick(index)}>
							View Answers
						</Button>
					</td>
				</tr>
			))}
		</tbody>
	);
};
