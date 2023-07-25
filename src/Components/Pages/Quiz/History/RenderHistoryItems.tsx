import { Button, Intent } from "@blueprintjs/core";
import { useMemo } from "react";
import { QuizSubmission } from "../../../../Api/Quiz/Models/QuizSubmissions";

interface IRenderHistoryItemsProps {
	items: QuizSubmission[];

	handleClick: (index: number) => void;
}

export const RenderHistoryItems: React.FC<IRenderHistoryItemsProps> = ({ items, handleClick }) => {
	const sortedItems = useMemo(
		() => items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
		[items]
	);

	return (
		<tbody>
			{sortedItems.map((item, index) => (
				<tr key={`${item.userId.id} ${item.timestamp}`}>
					<td>{item.userId.name}</td>

					<td>{item.correctCount}/{item.questions.length}</td>

					<td>{(item.duration / 1000).toFixed(1)}s</td>

					<td>{new Date(item.timestamp).toLocaleDateString()}</td>

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
