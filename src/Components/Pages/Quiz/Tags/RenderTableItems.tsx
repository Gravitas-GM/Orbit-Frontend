import { NonIdealState, HTMLTable, Button } from "@blueprintjs/core";
import { QuestionTag } from "../../../../Api/Quiz/Models/QuestionTags";

interface IRenderTableItemsProps {
	items: QuestionTag[];
	editCallback: (tag: QuestionTag) => void;
	deleteCallback: (tag: QuestionTag) => void;
}

export const RenderTableItems: React.FC<IRenderTableItemsProps> = ({ items, editCallback, deleteCallback }) => {
	if (items.length === 0) {
		return (
			<div style={{ textAlign: 'center'}}>
				<NonIdealState title="No tags found." />
			</div>
		);
	}

	return (
		<div className="question-list">
			<HTMLTable striped={true}>
				<thead>
					<tr>
						<th>Label</th>
						<th>Members</th>
						<th>Actions</th>
					</tr>
				</thead>

				<tbody>
					{items.map((tag) => (
						<tr key={tag.id}>
							<td>{tag.label}</td>

							<td style={{ width: 120 }}>
								{tag.members.length}
							</td>

							<td style={{ width: 80 }}>
								<div style={{ display: "flex", justifyContent: "space-between" }}>
									<Button icon="edit" minimal={true} onClick={() => editCallback(tag)}/>

									<Button icon="trash" minimal={true} onClick={() => deleteCallback(tag)}/>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</HTMLTable>
		</div>
	);
};