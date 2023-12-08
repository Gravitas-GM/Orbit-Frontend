import * as React from 'react';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {history} from '../../../../history';
import {Question, QuestionModel} from '../../../../Api/Quiz/Models/Questions';
import {toaster} from '../../../../toaster';
import {ObjectList} from '../../../ObjectList';
import {Blockquote, Button, Checkbox, HTMLTable, Intent} from '@blueprintjs/core';
import {LinkButton} from '../../../LinkButton';
import {DeleteDialog, DeleteSubject} from '../../../DeleteDialog';
import {renderKindLabel} from '../../../Utility/string';
import {allSettled, isRejectedResult} from '../../../Utility/promise';
import {Spacing} from '../../../../Styles/variables';

interface IState {
	questions: Question[];
	loading: boolean;
	deleteTargets: Question[];
	deleteSubject: string | undefined;
	selectedItems: Question[];
}

export class QuestionListPage extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: true,
		questions: [],
		deleteTargets: [],
		deleteSubject: undefined,
		selectedItems: [],
	};

	public async componentDidMount() {
		try {
			this.setState({
				questions: await QuestionModel.list({
					_default: true,
					'tag.label': true,
				}).then(response => response.data),
				loading: false,
			});
		} catch (error) {
			toaster.error('Failed to fetch questions');
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
					title="Questions"
					editorUrlPrefix="/quiz/questions"
					items={this.state.questions}
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

									<th>Prompt</th>
									<th>Type</th>
									<th>Tag</th>
									<th style={{textAlign: 'center', width: 100}}>Edit</th>
									<th style={{width: 100, textAlign: 'center'}}>Delete</th>
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
							? ' multiple questions'
							: ' a question with the following prompt'}
						:
					</p>

					{
						this.state.deleteTargets.length === 1 &&
							<Blockquote>
								{this.state.deleteTargets[0]?.prompt}
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

	private onItemFilter = (item: Question, searchText: string) => item.prompt.toLocaleLowerCase().includes(searchText);

	private isChecked = (item: Question) => this.state.selectedItems.includes(item);

	private isAllChecked = () => this.state.selectedItems.length === this.state.questions.length;

	private onSelectAllClick = () => {
		if (this.isAllChecked()) {
			this.setState({
				selectedItems: [],
			});
		} else {
			this.setState(state => ({
				selectedItems: [...state.questions],
			}));
		}
	};

	private onSelectClick = (item: Question) => {
		if (this.state.selectedItems.includes(item))
			this.setState(state => ({
				selectedItems: state.selectedItems.filter(selectedItem => selectedItem !== item),
			}));
		else
			this.setState(state => ({
				selectedItems: [...state.selectedItems, item],
			}));
	};

	private onDeleteClick = (target: Question) => this.setState({
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
				await QuestionModel.delete(item.id);

				return item;
			})
		);

		let failureCount = 0;
		const deletedItems: Question[] = [];

		for (const result of results) {
			if (isRejectedResult(result)) {
				failureCount++;
				continue;
			}

			deletedItems.push(result.value);
		}

		if (failureCount > 0)
			toaster.showUnhandledErrorMessage();

		toaster.success(`Question${this.state.selectedItems.length > 1 ? 's' : ''} deleted successfully`);

		this.setState(state => ({
			questions: state.questions.filter(item => !deletedItems.includes(item)),
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
	item: Question;
	onDelete: (item: Question) => void;
	onSelect: (item: Question) => void;
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

			<td>{item.prompt}</td>
			<td>{renderKindLabel(item.kind)}</td>
			<td>{item.tag?.label ?? '—'}</td>

			<td style={{textAlign: 'center'}}>
				<LinkButton to={`/quiz/questions/${item.id}`} icon="edit" minimal={true} />
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
