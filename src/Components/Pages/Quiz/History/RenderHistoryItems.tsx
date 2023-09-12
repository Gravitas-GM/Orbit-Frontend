import * as React from 'react';
import { AnchorButton, Intent } from "@blueprintjs/core";
import { useContext, useMemo } from "react";
import { QuizSubmission } from "../../../../Api/Quiz/Models/QuizSubmissions";
import { Permission } from "../../../../Permission";
import { UserContext } from "../../../../Session";
import {formatDate} from '../../../Utility/date';

interface IRenderHistoryItemsProps {
	items: QuizSubmission[];
}

export const RenderHistoryItems: React.FC<IRenderHistoryItemsProps> = ({items}) => {
	const User = useContext(UserContext);
	const sortedItems = useMemo(
		() => items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
		[items],
	);

	return (
		<tbody>
			{sortedItems.map((item, index) => (
				<tr key={`${item.user.id} ${item.timestamp}`}>
					{
						User?.permissions.includes(Permission.ADMIN) &&

						<td>{item.user.name}</td>
					}

				<td>{item.correctCount}/{item.questions.length}</td>

				<td>{formatDate(item.timestamp)}</td>

					<td>{showQuizScore(item)}</td>

					<td style={{ textAlign: "right"}} width={180}>
						<AnchorButton href={`/quiz/results/${item.id}`} intent={Intent.PRIMARY}>
							Show Results
						</AnchorButton>
					</td>
				</tr>
			))}
		</tbody>
	);
};

export const showQuizScore = (item: QuizSubmission) => {
	return <span>{Math.floor((item.correctCount / item.questions.length)*100)}% ({item.correctCount} / {item.questions.length})</span>;
};
