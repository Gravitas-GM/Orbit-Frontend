import * as React from 'react';
import {BankSurvey, BankSurveyModel} from '../../../../Api/Survey/Models/BankSurveys';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {history} from '../../../../history';
import {toaster} from '../../../../toaster';
import {ObjectList} from '../../../ObjectList';
import {Blockquote, Button, Checkbox, HTMLTable, Intent} from '@blueprintjs/core';
import {LinkButton} from '../../../LinkButton';
import {DeleteDialog, DeleteSubject} from '../../../DeleteDialog';
import {allSettled, isRejectedResult} from '../../../Utility/promise';
import {Spacing} from '../../../../Styles/variables';

interface IState {
	surveys: BankSurvey[];
	loading: boolean;
	deleteTargets: BankSurvey[];
	deleteSubject: string | undefined;
	selectedItems: BankSurvey[];
}

export class SurveyBankList extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: true,
		surveys: [],
		deleteTargets: [],
		deleteSubject: undefined,
		selectedItems: [],
	};

	public async componentDidMount() {
		try {
			this.setState({
				surveys: await BankSurveyModel.list().then(response => response.data),
				loading: false,
			});
		} catch (error) {
			toaster.error('Failed to fetch surveys');
			history.push('/');

			return;
		}
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<section className="gm-page-wrapper">
				<ObjectList
					title="Survey Bank"
					editorUrlPrefix="/survey-bank"
					items={this.state.surveys}
					onItemFilter={this.onItemFilter}
					itemsPerPage={20}
					onBulkDeleteClick={this.onBulkDeleteClick}
					bulkDeleteDisabled={this.state.selectedItems.length === 0}
				>
					{items => (
						<HTMLTable striped={true}>
							<thead>
								<tr>
									<th style={{width: Spacing.XLarge}}>
										<Checkbox
											checked={this.isAllChecked()}
											onClick={this.onSelectAllClick}
										/>
									</th>

									<th>Week</th>
									<th>Prompt</th>
									<th style={{textAlign: 'center', width: 100}}>Edit</th>
									<th style={{textAlign: 'center', width: 100}}>Delete</th>
								</tr>
							</thead>

							<tbody>
								{items.map(item => (
									<TableItem
										key={item.id}
										item={item}
										onDelete={this.onDeleteClick}
										onSelect={this.onSelectClick}
										isChecked={this.isChecked(item)}
									/>
								))}
							</tbody>
						</HTMLTable>
					)}
				</ObjectList>

				<DeleteDialog
					isOpen={this.state.deleteTargets.length > 0}
					subject={this.state.deleteSubject}
					multiple={this.state.deleteTargets.length > 1}
					onConfirm={this.onDeleteConfirm}
					onCancel={this.onDeleteCancel}
				>
					<p>
						You are about to delete
						{this.state.deleteTargets.length > 1
							? ' multiple surveys'
							: ' a survey with the following question prompt'}
						:
					</p>

					{
						this.state.deleteTargets.length === 1 &&
						<Blockquote>
							{this.state.deleteTargets[0]?.questions[0]?.prompt}
						</Blockquote>
					}

					<p>
						This action cannot be undone.
						To confirm, please type "{DeleteSubject.DELETE}" in the box below,
						then click "Confirm".
					</p>
				</DeleteDialog>
			</section>
		);
	}

	private onItemFilter = (item: BankSurvey, searchText: string) => item.questions[0]?.prompt.toLocaleLowerCase().includes(searchText);

	private isChecked = (item: BankSurvey) => this.state.selectedItems.includes(item);

	private isAllChecked = () => this.state.selectedItems.length === this.state.surveys.length;

	private onSelectAllClick = () => {
		if (this.isAllChecked()) {
			this.setState({
				selectedItems: [],
			});
		} else {
			this.setState(state => ({
				selectedItems: [...state.surveys],
			}));
		}
	};

	private onSelectClick = (item: BankSurvey) => {
		if (this.state.selectedItems.includes(item))
			this.setState(state => ({
				selectedItems: state.selectedItems.filter(selectedItem => selectedItem !== item),
			}));
		else
			this.setState(state => ({
				selectedItems: [...state.selectedItems, item],
			}));
	};

	private onDeleteClick = (target: BankSurvey) => this.setState({
		deleteTargets: [target],
		deleteSubject: DeleteSubject.DELETE,
	});

	private onBulkDeleteClick = () => this.setState(state => ({
		deleteTargets: state.selectedItems,
		deleteSubject: DeleteSubject.DELETE,
	}));

	private onDeleteConfirm = async () => {
		if (this.state.deleteTargets.length === 0)
			return;

		const results = await allSettled(
			this.state.deleteTargets.map(async item => {
				await BankSurveyModel.delete(item.id);

				return item;
			})
		);

		let failureCount = 0;
		const deletedItems: BankSurvey[] = [];

		for (const result of results) {
			if (isRejectedResult(result)) {
				failureCount++;
				continue;
			}

			deletedItems.push(result.value);
		}

		if (failureCount > 0)
			toaster.showUnhandledErrorMessage();

		toaster.success(`Survey${this.state.selectedItems.length > 1 ? 's' : ''} deleted successfully`);

		this.setState(state => ({
			surveys: state.surveys.filter(item => !deletedItems.includes(item)),
			selectedItems: state.selectedItems.filter(item => !deletedItems.includes(item)),
			deleteTargets: [],
		}));
	};

	private onDeleteCancel = () => this.setState({
		deleteTargets: [],
		deleteSubject: undefined,
	});
}

interface TableItemProps {
	item: BankSurvey;
	onDelete: (item: BankSurvey) => void;
	onSelect: (item: BankSurvey) => void;
	isChecked: boolean;
}

const TableItem: React.FC<TableItemProps> = ({item, onDelete, onSelect, isChecked}) => {
	const onDeleteButtonClick = React.useCallback(() => {
		onDelete(item);
	}, [item, onDelete]);

	const onSelectButtonClick = React.useCallback(() => {
		onSelect(item);
	}, [item, onSelect]);

	return (
		<tr>
			<td>
				<Checkbox checked={isChecked} onClick={onSelectButtonClick} />
			</td>

			<td>{item.week}</td>
			<td>{item.questions[0]?.prompt ?? '—'}</td>

			<td style={{textAlign: 'center'}}>
				<LinkButton to={`/survey-bank/${item.id}`} icon="edit" minimal={true} />
			</td>

			<td style={{textAlign: 'center'}}>
				<Button
					icon="delete"
					intent={Intent.DANGER}
					onClick={onDeleteButtonClick}
					minimal={true}
				/>
			</td>
		</tr>
	);
};
