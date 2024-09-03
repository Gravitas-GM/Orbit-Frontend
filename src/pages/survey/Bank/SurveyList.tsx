import {Blockquote, Button, Checkbox, HTMLTable, Menu, MenuItem} from '@blueprintjs/core';
import * as React from 'react';
import {PureComponent, ReactElement, useCallback, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {isApiErrorResponse} from '../../../api/errors/symfony';
import {BankSurvey, SurveyBankModel} from '../../../api/Survey/Models/SurveyBank';
import {Classes as GMClasses} from '../../../classes';
import {ControlsMenu} from '../../../components/ControlsMenu';
import {DeleteDialog} from '../../../components/DeleteDialog';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {LinkedMenuItem} from '../../../components/NavHeader/LinkedMenuItem';
import {ObjectList} from '../../../components/ObjectList';
import {PageHeader} from '../../../components/PageHeader';
import {Spacing} from '../../../Styles/variables';
import {toaster} from '../../../toaster';
import {allSettled, isRejectedResult} from '../../../utility/promise';

interface State {
	// Also used to derive our loading state. If `surveys` is null, the component has not finished loading yet.
	surveys: BankSurvey[],

	// There can never be more than one recurring survey, but we store it as an array of either zero or one element so
	// we don't have to constantly rebuild the array to pass it down to `BankTable`.
	recurringSurvey: BankSurvey[],
	deleteTargets: BankSurvey[] | null,
	loading: boolean,
	processing: boolean,
	redirect: string | null,
}

export class SurveyList extends PureComponent<{}, State> {
	public state: Readonly<State> = {
		surveys: [],
		recurringSurvey: [],
		deleteTargets: null,
		loading: true,
		processing: false,
		redirect: null,
	};

	public async componentDidMount(): Promise<void> {
		await this.refresh();
	}

	public render(): ReactElement {
		if (this.state.loading)
			return <FrameLoadingSpinner />;
		else if (this.state.redirect !== null)
			return <Navigate to={this.state.redirect} />;

		return (
			<>
				<div className={GMClasses.PAGE_WRAPPER}>
					<PageHeader title="Survey Bank">
						<Button
							intent="primary"
							icon="add"
							text="Create New Survey"
							onClick={this.onNewBankItemClick}
							loading={this.state.processing}
						/>
					</PageHeader>
				</div>

				<BankTable
					title="Recurring Survey"
					items={this.state.recurringSurvey}
					onDelete={this.onItemDelete}
					onBulkDelete={this.onBulkItemDelete}
				/>

				<BankTable
					title="Rotating Surveys"
					items={this.state.surveys}
					showWeek={true}
					onDelete={this.onItemDelete}
					onBulkDelete={this.onBulkItemDelete}
				/>

				<DeleteDialog
					isOpen={this.state.deleteTargets !== null}
					onConfirm={this.onItemDeleteConfirm}
					onCancel={this.onItemDeleteCancel}
					subject="DELETE"
				>
					{this.state.deleteTargets?.length === 1 && (
						<>
							<p>
								You are about to permanently delete the
								{this.state.deleteTargets[0].week === 0 ? (
									<> recurring survey</>
								) : (
									<> survey bank item for Week #{this.state.deleteTargets[0].week}</>
								)} with the following prompt(s).
							</p>

							{this.state.deleteTargets[0].questions.map(q => (
								<Blockquote key={q.id}>
									{q.prompt}
								</Blockquote>
							))}
						</>
					)}

					{(this.state.deleteTargets?.length ?? 0) > 1 && (
						<p>
							You are about to delete several survey bank items.
						</p>
					)}

					<p>
						This action cannot be reversed. To confirm, please type "DELETE" in the box below, then click
						"Confirm."
					</p>
				</DeleteDialog>
			</>
		);
	}

	private onBulkItemDelete: BulkDeleteFn = items => this.setState({
		deleteTargets: items,
	});

	private onItemDelete: ItemDeleteFn = item => this.setState({
		deleteTargets: [item],
	});

	private onItemDeleteConfirm = async () => {
		if (!this.state.deleteTargets || this.state.deleteTargets.length === 0)
			return;

		const promises = this.state.deleteTargets.map(target => SurveyBankModel.delete(target.id));
		const results = await allSettled(promises);
		const failures = results.filter(isRejectedResult);

		if (failures.length > 0)
			toaster.warning('Some survey bank items could not be deleted. Please try again later.');
		else
			toaster.success('Your selected survey bank items have been deleted.');

		this.setState({
			deleteTargets: null,
		});

		// noinspection ES6MissingAwait
		this.refresh();
	};

	private onItemDeleteCancel = () => this.setState({
		deleteTargets: null,
	});

	private onNewBankItemClick = async () => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		let id: number;

		try {
			const response = await SurveyBankModel.create({});
			id = response.data.id;
		} catch (error) {
			if (isApiErrorResponse(error))
				toaster.error(error.error.message);
			else
				toaster.showUnhandledErrorMessage();

			return;
		} finally {
			this.setState({
				processing: false,
			});
		}

		this.setState({
			redirect: '/survey/bank/' + id,
		});
	};

	private refresh = async () => {
		this.setState({
			surveys: [],
			recurringSurvey: [],
			loading: true,
		});

		let surveys: BankSurvey[];

		try {
			surveys = await SurveyBankModel.list().then(r => r.data);
		} catch (error) {
			toaster.showApiErrorMessage(error);
			return;
		}

		surveys.sort((a, b) => a.week - b.week);

		const recurringSurvey = surveys.shift() ?? null;

		this.setState({
			recurringSurvey: recurringSurvey ? [recurringSurvey] : [],
			surveys,
			loading: false,
		});
	};
}

type BulkDeleteFn = (items: BankSurvey[]) => void;

interface BankTableProps {
	title: string,
	items: BankSurvey[],
	onDelete: ItemDeleteFn,
	onBulkDelete?: BulkDeleteFn,
	showWeek?: boolean,
}

function BankTable({title, items, showWeek, onDelete, onBulkDelete}: BankTableProps): ReactElement {
	const [selected, setSelected] = useState<BankSurvey[]>([]);

	const onSelectAllClick = useCallback(() => {
		setSelected(selected => {
			if (selected.length === items.length)
				return [];
			else
				return [...items];
		});
	}, [items]);

	const onItemSelectClick = useCallback<ItemSelectFn>(item => {
		setSelected(selected => {
			if (selected.includes(item))
				return selected.filter(value => value !== item);
			else
				return [...selected, item];
		});
	}, []);

	const onBulkDeleteClick = useCallback(() => {
		if (selected.length < 1)
			return;

		onBulkDelete?.(selected);
	}, [onBulkDelete, selected]);

	return (
		<ObjectList
			title={title}
			items={items}
			onBulkDeleteClick={onBulkDeleteClick}
			bulkDeleteDisabled={selected.length === 0}
		>
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
								onDelete={onDelete}
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
				{item.questions.length > 0 ?
					item.questions.map(question => <div key={question.id}>{question.prompt}</div>) :
					<>&mdash;</>
				}
			</td>

			<td style={{textAlign: 'right'}}>
				<ControlsMenu>
					<Menu>
						<LinkedMenuItem to={`/survey/bank/${item.id}`} icon="edit" text="Edit" />
						<MenuItem intent="danger" icon="delete" text="Delete" onClick={onDeleteClick} />
					</Menu>
				</ControlsMenu>
			</td>
		</tr>
	);
}
