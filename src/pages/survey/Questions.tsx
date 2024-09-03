import {Blockquote, Checkbox, Classes, HTMLTable, Menu, MenuItem} from '@blueprintjs/core';
import {ReactElement, useCallback, useState} from 'react';
import {BankSurvey} from '../../api/Survey/Models/SurveyBank';
import {BankQuestion} from '../../api/Survey/Models/SurveyBankQuestion';
import {Survey} from '../../api/Survey/Models/Survey';
import {SurveyQuestion} from '../../api/Survey/Models/SurveyQuestion';
import {ControlsMenu} from '../../components/ControlsMenu';
import {DeleteDialog} from '../../components/DeleteDialog';
import {LinkedMenuItem} from '../../components/NavHeader/LinkedMenuItem';
import {ObjectList} from '../../components/ObjectList';
import {Spacing} from '../../Styles/variables';
import {ucwords} from '../../utility/string';

export type DeleteFn<Parent extends Surveys> = (items: Array<QuestionItem<Parent>>) => Promise<void>;

type Surveys = Survey | BankSurvey;

interface Props<T extends Surveys> {
	title: string,
	survey: T,
	baseUri: string,
	onQuestionDelete: DeleteFn<T>,
}

export function Questions<T extends Surveys>({survey, baseUri, onQuestionDelete, title}: Props<T>): ReactElement {
	const [selected, setSelected] = useState<Array<QuestionItem<T>>>([]);
	const [deleteTargets, setDeleteTargets] = useState<Array<QuestionItem<T>>>([]);

	const onSelectAllClick = useCallback(() => setSelected(selected => {
		if (selected.length !== survey.questions.length)
			return survey.questions;
		else
			return [];
	}), [survey.questions]);

	const onItemSelect: SelectFn<T> = useCallback(item => setSelected(selected => {
		if (selected.includes(item))
			return selected.filter(i => i !== item);
		else
			return [...selected, item];
	}), []);

	const onBulkDeleteClick = useCallback(() => setDeleteTargets(selected), [onQuestionDelete, selected]);
	const onDeleteClick: DeleteClickFn<T> = useCallback(setDeleteTargets, []);
	const onDeleteCancel = useCallback(() => setDeleteTargets([]), []);
	const onDeleteConfirm = useCallback(async () => {
		await onQuestionDelete(deleteTargets);
	}, [deleteTargets]);

	const deleteSubject = deleteTargets.length === 1 ? 'a question' : 'multiple questions';

	return (
		<>
			<ObjectList
				items={survey.questions}
				title={title}
				setPageTitle={true}
				onBulkDeleteClick={onBulkDeleteClick}
				bulkDeleteDisabled={selected.length === 0}
				editorUrlPrefix={baseUri}
			>
				{items => (
					<HTMLTable striped={true}>
						<thead>
							<tr>
								<th style={{width: Spacing.XLarge}}>
									<Checkbox
										checked={selected.length === survey.questions.length}
										onClick={onSelectAllClick}
									/>
								</th>

								<th>Question Type</th>
								<th>Prompt</th>
								<th style={{width: Spacing.XLarge}}>&nbsp;</th>
							</tr>
						</thead>

						<tbody>
							{items.map(item => (
								<Item<T>
									key={item.id}
									item={item}
									onDelete={onDeleteClick}
									baseUri={baseUri}
									isSelected={selected.includes(item)}
									onSelect={onItemSelect}
								/>
							))}
						</tbody>
					</HTMLTable>
				)}
			</ObjectList>

			<DeleteDialog
				isOpen={deleteTargets.length > 0}
				onConfirm={onDeleteConfirm}
				onCancel={onDeleteCancel}
				subject="DELETE"
			>
				<>
					<p>
						You are about to delete {deleteSubject} with the following
						prompt{deleteTargets.length !== 1 ? 's' : ''}:
					</p>

					{deleteTargets.map(item => (
						<Blockquote>{item.prompt}</Blockquote>
					))}

					<p>
						This action cannot be undone. To confirm, type "DELETE" in the box below then click "Confirm."
					</p>
				</>
			</DeleteDialog>
		</>
	);
}

type QuestionItem<Parent extends Surveys> = Parent extends BankSurvey ? BankQuestion : SurveyQuestion;
type DeleteClickFn<Parent extends Surveys> = (item: Array<QuestionItem<Parent>>) => void;
type SelectFn<Parent extends Surveys> = (item: QuestionItem<Parent>) => void;

interface ItemProps<Parent extends Surveys> {
	item: QuestionItem<Parent>,
	onDelete: DeleteClickFn<Parent>,
	baseUri: string,
	isSelected: boolean,
	onSelect: SelectFn<Parent>,
}

function Item<Parent extends Surveys>({
	item,
	onDelete,
	baseUri,
	isSelected,
	onSelect,
}: ItemProps<Parent>): ReactElement {
	const onDeleteClick = useCallback(() => {
		onDelete([item]);
	}, [onDelete, item]);

	const onItemSelect = useCallback(() => {
		onSelect(item);
	}, [onSelect, item]);

	return (
		<tr>
			<td>
				<Checkbox checked={isSelected} onClick={onItemSelect} />
			</td>

			<td>{ucwords(item.kind)}</td>
			<td className={Classes.TEXT_OVERFLOW_ELLIPSIS}>{item.prompt}</td>

			<td style={{textAlign: 'right'}}>
				<ControlsMenu>
					<Menu>
						<LinkedMenuItem to={`${baseUri}/${item.id}`} icon="edit" text="Edit" />
						<MenuItem intent="danger" icon="delete" text="Delete" onClick={onDeleteClick} />
					</Menu>
				</ControlsMenu>
			</td>
		</tr>
	);
}
