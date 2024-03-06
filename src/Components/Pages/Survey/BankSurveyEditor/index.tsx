import {FormEvent} from 'react';
import * as React from 'react';
import {Blockquote, Button, Checkbox, HTMLTable, Intent, Switch} from '@blueprintjs/core';
import {ValidationFailures} from '../../../../Api/errors/symfony';
import {BankQuestion, BankQuestionModel} from '../../../../Api/Survey/Models/BankQuestions';
import {BankSurvey, BankSurveyModel} from '../../../../Api/Survey/Models/BankSurveys';
import {Classes} from '../../../../classes';
import {Spacing} from '../../../../Styles/variables';
import {DeleteDialog, DeleteSubject} from '../../../DeleteDialog';
import {LinkButton} from '../../../LinkButton';
import {ObjectList} from '../../../ObjectList';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {Redirect, RouteComponentProps} from 'react-router';
import {toaster} from '../../../../toaster';
import {PageHeader} from '../../../PageHeader';
import {allSettled, isRejectedResult} from '../../../Utility/promise';
import {renderKindLabel} from '../../../Utility/string';
import {ValidationAwareFormGroup} from '../../../ValidationAwareFormGroup';

interface IState {
	loading: boolean;
	processing: boolean;
	redirect: boolean;
	survey: BankSurvey | null;
	questions: BankQuestion[];
	protected: boolean;
	deleteTargets: BankQuestion[];
	deleteSubject: string | undefined;
	selectedItems: BankQuestion[];
	failures: ValidationFailures | null;
	dirty: boolean;
}

interface RouteProps {
	survey?: string;
}

export class SurveyEditor extends React.PureComponent<RouteComponentProps<RouteProps>, IState> {
	public state: Readonly<IState> = {
		loading: true,
		processing: false,
		redirect: false,
		survey: null,
		questions: [],
		protected: false,
		deleteTargets: [],
		deleteSubject: undefined,
		selectedItems: [],
		failures: null,
		dirty: false,
	};

	public async componentDidMount() {
		const idParam = this.props.match.params.survey;

		if (idParam) {
			try {
				await BankSurveyModel.read(idParam).then(r => this.setState({
					survey: r.data,
					questions: r.data.questions,
					protected: r.data.protected,
				}));
			} catch (error) {
				toaster.showUnhandledErrorMessage();

				this.setState({
					redirect: true,
				});

				return;
			}
		}

		this.setState({
			loading: false,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;
		else if (this.state.redirect)
			return <Redirect to="/survey-bank" />;

		return (
			<section className={Classes.PAGE_WRAPPER}>
				<PageHeader title={this.props.match.params.survey ? `Edit Bank Survey` : `New Bank Survey`} />

				<form onSubmit={this.onSaveClick} style={{display: 'flex', flexDirection: 'column'}}>
					<div style={{display: 'flex', justifyContent: 'right'}}>
						<Button loading={this.state.processing} type="submit" intent={Intent.PRIMARY} text="Save" />
					</div>

					<ValidationAwareFormGroup
						labelFor="protected"
						failures={this.state.failures}
						style={{maxWidth: 800}}
					>
						<div className="settings-switch-container">
							<span>
								Protected
							</span>

							<Switch
								checked={this.state.protected}
								onChange={this.onProtectedChange}
								large={true}
								inline={true}
							/>
						</div>

						<span>
							When enabled, this survey won't be editable by an account admin.
						</span>
					</ValidationAwareFormGroup>
				</form>

				<ObjectList
					title="Questions"
					editorUrlPrefix={`/survey-bank/${this.state.survey?.id ?? 'new'}/questions`}
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

	private onProtectedChange = (event: FormEvent<HTMLInputElement>) => this.setState({
		protected: event.currentTarget.checked,
		dirty: true,
	});

	private onItemFilter = (item: BankQuestion, searchText: string) =>
		item.prompt.toLocaleLowerCase().includes(searchText);

	private isChecked = (item: BankQuestion) => this.state.selectedItems.includes(item);

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

	private onSelectClick = (item: BankQuestion) => {
		if (this.state.selectedItems.includes(item))
			this.setState(state => ({
				selectedItems: state.selectedItems.filter(selectedItem => selectedItem !== item),
			}));
		else
			this.setState(state => ({
				selectedItems: [...state.selectedItems, item],
			}));
	};

	private onDeleteClick = (target: BankQuestion) => this.setState({
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
				await BankQuestionModel.delete(item.id);

				return item;
			})
		);

		let failureCount = 0;
		const deletedItems: BankQuestion[] = [];

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

	private onSaveClick = async () => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		try {
			if (this.state.survey)
				await BankSurveyModel.update(this.state.survey.id, {
					protected: this.state.protected,
				});
			else
				await BankSurveyModel.create({
					protected: this.state.protected,
				});
		} catch (error) {
			throw error;
		} finally {
			this.setState({
				processing: false,
			});
		}

		const action = this.state.survey ? 'updated' : 'created';
		toaster.success(`Bank Survey ${action} successfullly.`);

		this.setState({
			dirty: false,
		});
	}
}

interface TableItemProps {
	item: BankQuestion;
	onDelete: (item: BankQuestion) => void;
	onSelect: (item: BankQuestion) => void;
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

			<td style={{textAlign: 'center'}}>
				<LinkButton to={`/survey/bank/${item.id}`} icon="edit" minimal={true} />
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
