import {Checkbox, HTMLTable, Menu, MenuItem} from '@blueprintjs/core';
import {ReactElement, useCallback, useEffect, useState} from 'react';
import {ApiError} from '../../../api/errors/symfony';
import {BankSurvey, SurveyBankModel} from '../../../api/Survey/Models/SurveyBankModel';
import {Classes as GMClasses} from '../../../classes';
import {ControlsMenu} from '../../../components/ControlsMenu';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {NonIdealState} from '../../../components/NonIdealState';
import {ObjectList} from '../../../components/ObjectList';
import {PageHeader} from '../../../components/PageHeader';
import {Spacing} from '../../../Styles/variables';
import {toaster} from '../../../toaster';

export function Bank(): ReactElement {
	// Also used to derive our loading state. The component is loading when `surveys` is null.
	const [surveys, setSurveys] = useState<BankSurvey[] | null>(null);
	const [recurringSurvey, setRecurringSurvey] = useState<BankSurvey | null>(null);

	useEffect(() => {
		SurveyBankModel.list()
			.then(response => {
				const surveys = response.data;

				if (surveys.length > 0)
					setRecurringSurvey(surveys.shift()!);

				setSurveys(surveys);
			})
			.catch(error => {
				if (error instanceof ApiError)
					toaster.error(error.message);
				else
					toaster.showUnhandledErrorMessage();
			});
	}, []);

	if (surveys === null)
		return <FrameLoadingSpinner />;
	else if (!recurringSurvey)
		return <NonIdealState title="No items found." />;

	return (
		<>
			<div className={GMClasses.PAGE_WRAPPER}>
				<PageHeader title="Survey Bank" />
			</div>

			<BankTable title="Recurring Survey" items={[recurringSurvey]} />

			<BankTable title="Rotating Surveys" items={surveys} showWeek={true} />
		</>
	);
}

interface BankTableProps {
	title: string,
	items: BankSurvey[],
	showWeek?: boolean,
}

function BankTable({title, items, showWeek}: BankTableProps): ReactElement {
	const [selected, setSelected] = useState<BankSurvey[]>([]);

	const onSelectAllClick = useCallback(() => {
		setSelected(selected => {
			if (selected.length === items.length)
				return [];
			else
				return [...items];
		});
	}, [items]);

	const onItemDeleteClick = useCallback<ItemDeleteFn>(item => {

	}, []);

	const onItemSelectClick = useCallback<ItemSelectFn>(item => {

	}, []);

	return (
		<ObjectList title={title} items={items}>
			{items => (
				<HTMLTable striped={true}>
					<thead>
						<tr>
							<th style={{width: Spacing.XLarge}}>
								<Checkbox checked={selected.length === items.length} onClick={onSelectAllClick} />
							</th>

							{showWeek && <th>Week</th>}

							<th>Prompt(s)</th>

							<th style={{width: 100}} />
						</tr>
					</thead>

					<tbody>
						{items.map(item => (
							<TableItem
								key={item.id}
								item={item}
								selected={selected.includes(item)}
								onDelete={onItemDeleteClick}
								onSelect={onItemSelectClick}
								showWeek={showWeek}
							/>
						))}
					</tbody>
				</HTMLTable>
			)}
		</ObjectList>
	);
}

type ItemDeleteFn = (item: BankSurvey) => void;
type ItemSelectFn = (item: BankSurvey) => void;

interface TableItemProps {
	item: BankSurvey,
	selected: boolean,
	onDelete: ItemDeleteFn,
	onSelect: ItemSelectFn,
	showWeek?: boolean,
}

function TableItem({item, selected, onSelect, onDelete, showWeek}: TableItemProps): ReactElement {
	const onCheckboxClick = useCallback(() => {
		onSelect(item);
	}, [onSelect, item]);

	const onDeleteClick = useCallback(() => {
		onDelete(item);
	}, [onDelete, item]);

	return (
		<tr>
			<td>
				<Checkbox checked={selected} onClick={onCheckboxClick} />
			</td>

			{showWeek && <td>Week #{item.week}</td>}

			<td>
				{item.questions.map(question => <div>{question.prompt}</div>)}
			</td>

			<td style={{textAlign: 'right'}}>
				<ControlsMenu>
					<Menu>
						<MenuItem icon="delete" text="Delete" />
						<MenuItem text="Testing" />
					</Menu>
				</ControlsMenu>
			</td>
		</tr>
	);
}
