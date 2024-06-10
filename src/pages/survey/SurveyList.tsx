import {Checkbox, Classes, HTMLTable, Menu, MenuItem} from '@blueprintjs/core';
import {ReactElement, useCallback, useState} from 'react';
import {BankSurvey} from '../../api/Survey/Models/SurveyBankModel';
import {BankQuestion} from '../../api/Survey/Models/SurveyBankQuestionModel';
import {Survey} from '../../api/Survey/Models/SurveyModel';
import {SurveyQuestion} from '../../api/Survey/Models/SurveyQuestion';
import {ControlsMenu} from '../../components/ControlsMenu';
import {LinkedMenuItem} from '../../components/NavHeader/LinkedMenuItem';
import {ObjectList} from '../../components/ObjectList';
import {Spacing} from '../../Styles/variables';
import {ucwords} from '../../utility/string';

type Surveys = Survey | BankSurvey;

interface Props<T extends Surveys> {
	survey: T,
	baseUri: string,
	onQuestionDelete: DeleteFn<T>,
}

export function SurveyList<T extends Surveys>({survey, baseUri, onQuestionDelete}: Props<T>): ReactElement {
	const [selected, setSelected] = useState<Array<QuestionItem<T>>>([]);

	const onSelectAllClick = useCallback(() => setSelected(selected => {
		if (selected.length !== survey.questions.length)
			return survey.questions;
		else
			return [];
	}), [survey.questions]);

	const onItemSelect = useCallback<SelectFn<T>>(item => setSelected(selected => {
		if (selected.includes(item))
			return selected.filter(i => i !== item);
		else
			return [...selected, item];
	}), []);

	const onBulkDeleteClick = useCallback(() => onQuestionDelete(selected), [onQuestionDelete, selected]);

	return (
		<ObjectList
			items={survey.questions}
			title="Survey Questions"
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
								item={item}
								onDelete={onQuestionDelete}
								baseUri={baseUri}
								isSelected={selected.includes(item)}
								onSelect={onItemSelect}
							/>
						))}
					</tbody>
				</HTMLTable>
			)}
		</ObjectList>
	);
}

type QuestionItem<Parent extends Surveys> = Parent extends BankSurvey ? BankQuestion : SurveyQuestion;
type DeleteFn<Parent extends Surveys> = (item: Array<QuestionItem<Parent>>) => void;
type SelectFn<Parent extends Surveys> = (item: QuestionItem<Parent>) => void;

interface ItemProps<Parent extends Surveys> {
	item: QuestionItem<Parent>,
	onDelete: DeleteFn<Parent>,
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
