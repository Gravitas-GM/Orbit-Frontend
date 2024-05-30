import * as React from 'react';
import {
	Button,
	Checkbox,
	Classes,
	Dialog,
	FormGroup,
	HTMLTable,
	InputGroup,
	Intent,
	NumericInput,
} from '@blueprintjs/core';
import {PointSourceItem, PointSourceModel} from '../../../Api/Point-Tracking/Models/Sources';
import {withAppUser, WithAppUserProps} from '../../../contexts/SessionContext';
import {toaster} from '../../../toaster';
import {DeleteDialog, DeleteSubject} from '../../../Components/DeleteDialog';
import {FrameLoadingSpinner} from '../../../Components/FrameLoadingSpinner';
import {replace} from '../../../utility/array';
import {AssignPointsDialog} from './AssignPointsDialog';
import {Classes as GmClasses} from '../../../classes';
import {ObjectList} from '../../../Components/ObjectList';
import {TableItem} from './TableItem';
import {allSettled, isRejectedResult} from '../../../utility/promise';
import {Spacing} from '../../../Styles/variables';

interface State {
	deleteTargets: PointSourceItem[];
	isEditSource: boolean;
	selectedSource: PointSourceItem | null;
	selectedItems: PointSourceItem[];
	deleteSubject: string | undefined;
	showAsssignPointsDialog: boolean;
	sources: PointSourceItem[];
	sourceName: string;
	pointValue: number;
	showSourceDialog: boolean;
	loading: boolean;
	processing: boolean;
}

class SourcesList extends React.PureComponent<WithAppUserProps, State> {
	public state: Readonly<State> = {
		selectedItems: [],
		deleteTargets: [],
		deleteSubject: undefined,
		isEditSource: false,
		selectedSource: null,
		showAsssignPointsDialog: false,
		sources: [],
		sourceName: '',
		pointValue: 0,
		showSourceDialog: false,
		loading: true,
		processing: false,
	};

	public async componentDidMount() {
		let sources: PointSourceItem[] = [];

		try {
			sources = await PointSourceModel.list(this.props.user.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();
		}

		this.setState({
			sources: sources.sort((a, b) => a.name.localeCompare(b.name)),
			loading: false,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<div className={GmClasses.PAGE_WRAPPER}>
				<ObjectList
					onBulkDeleteClick={this.onBulkDeleteClick}
					bulkDeleteDisabled={this.state.selectedItems.length === 0}
					items={this.state.sources}
					title="Sources"
					onAddNewClick={this.onAddButtonClick}
					onItemFilter={this.onItemFilter}
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

									<th>Name</th>
									<th>Value</th>
									<th style={{width: 100, textAlign: 'center'}}>Edit</th>
								</tr>
							</thead>

							<tbody>
								{items.map(source => (
									<TableItem
										key={source.id.$oid}
										item={source}
										onAssignPoints={this.onAssignPointsClick}
										onEdit={this.onEditClick}
										onDelete={this.onDeleteClick}
										onSelect={this.onSelectClick}
										processing={this.state.processing}
										isChecked={this.isChecked(source)}
									/>
								))}
							</tbody>
						</HTMLTable>
					)}
				</ObjectList>

				{this.state.showSourceDialog && (
					<Dialog
						onClose={this.onSourceDialogClose}
						isOpen={true}
						title={this.state.isEditSource ? 'Edit Source' : 'Add Source'}
					>
						<div className={Classes.DIALOG_BODY}>
							<form onSubmit={this.onSourceDialogSubmit}>
								<FormGroup
									label="Source Name"
									labelFor="sourceName"
								>
									<InputGroup
										autoFocus={!this.state.isEditSource}
										value={this.state.sourceName}
										onChange={this.onSourceNameChange}
										disabled={this.state.isEditSource}
									/>
								</FormGroup>

								<FormGroup
									label="Point Value"
									labelFor="pointValue"
								>
									<NumericInput
										autoFocus={this.state.isEditSource}
										min={0}
										name="pointValue"
										onValueChange={this.onPointValueChange}
										value={this.state.pointValue}
										fill={true}
									/>
								</FormGroup>
							</form>
						</div>

						<div className={Classes.DIALOG_FOOTER}>
							<div className={Classes.DIALOG_FOOTER_ACTIONS}>
								<Button
									text="Cancel"
									onClick={this.onSourceDialogClose}
									disabled={this.state.processing}
								/>

								<Button
									intent={Intent.PRIMARY}
									text="Submit"
									onClick={this.onSourceDialogSubmit}
									loading={this.state.processing}
								/>
							</div>
						</div>
					</Dialog>
				)}

				<DeleteDialog
					isOpen={this.state.deleteTargets.length > 0}
					subject={this.state.deleteSubject}
					onConfirm={this.onDeleteConfirm}
					onCancel={this.onDeleteCancel}
					multiple={this.state.deleteTargets.length > 1}
				/>

				{this.state.showAsssignPointsDialog && this.state.selectedSource && (
					<AssignPointsDialog
						source={this.state.selectedSource}
						onClose={this.onAssignPointsDialogClose}
					/>
				)}
			</div>
		);
	}

	private onItemFilter = (source: PointSourceItem, searchText: string): any =>
		source.name.toLocaleLowerCase().includes(searchText);

	private isChecked = (item: PointSourceItem) => this.state.selectedItems.includes(item);

	private isAllChecked = () => this.state.selectedItems.length === this.state.sources.length;

	private onSelectAllClick = () => {
		if (this.isAllChecked())
			this.setState({selectedItems: []});
		else
			this.setState(state => ({selectedItems: state.sources}));
	}

	private onSelectClick = (selectedSource: PointSourceItem) => {
		if (this.state.selectedItems.includes(selectedSource))
			this.setState(state => ({
				selectedItems: state.selectedItems.filter(item => item !== selectedSource),
			}));
		else
			this.setState(state => ({
				selectedItems: [...state.selectedItems, selectedSource],
			}));
	};

	private onAddButtonClick = () => this.setState({
		showSourceDialog: true,
		isEditSource: false,
	});

	private onSourceDialogClose = () => this.setState({
		showSourceDialog: false,
		isEditSource: false,
		sourceName: '',
		pointValue: 0,
	});

	private onSourceNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		sourceName: event.currentTarget.value,
	});

	private onPointValueChange = (pointValue: number) => this.setState({
		pointValue,
	});

	private onAssignPointsClick = (selectedSource: PointSourceItem) => this.setState({
		selectedSource,
		showAsssignPointsDialog: true,
	});

	private onAssignPointsDialogClose = () => this.setState({
		selectedSource: null,
		showAsssignPointsDialog: false,
	});

	private onEditClick = (selectedSource: PointSourceItem) => this.setState({
		selectedSource,
		isEditSource: true,
		showSourceDialog: true,
		sourceName: selectedSource.name,
		pointValue: selectedSource.point_value,
	});

	private onSourceDialogSubmit = async (event: React.SyntheticEvent<any>) => {
		event.preventDefault();

		if (this.state.processing)
			return;

		if (this.state.sourceName === '') {
			toaster.error('Please set a source name.');

			return;
		}

		this.setState({
			processing: true,
		});

		let source: PointSourceItem;

		try {
			source = await PointSourceModel.set(this.props.user.account.id, {
				name: this.state.sourceName,
				point_value: this.state.pointValue,
			}).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				isEditSource: false,
				showSourceDialog: false,
				processing: false,
				selectedSource: null,
			});

			return;
		}

		toaster.success(this.state.isEditSource ? 'Source edited.' : 'Source created.');

		let sources: PointSourceItem[];

		if (this.state.isEditSource)
			sources = replace(this.state.sources, this.state.selectedSource!, source);
		else
			sources = [...this.state.sources, source].sort((a, b) => a.name.localeCompare(b.name));

		this.setState({
			sources,
			selectedSource: null,
			isEditSource: false,
			showSourceDialog: false,
			sourceName: '',
			pointValue: 0,
			processing: false,
		});
	};

	private onBulkDeleteClick = () => this.setState(state => ({
			deleteTargets: state.selectedItems,
			deleteSubject: state.selectedItems.length > 1 ? DeleteSubject.DELETE : state.selectedItems[0].name,
	}));

	private onDeleteClick = (item: PointSourceItem) => this.setState({
		deleteTargets: [item],
		deleteSubject: item.name,
	});

	private onDeleteCancel = () => this.setState({
		deleteTargets: [],
	});

	private onDeleteConfirm = async () => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		const results = await allSettled(
			this.state.deleteTargets.map(async item => {
				await PointSourceModel.delete(item.id);

				return item;
			})
		);

		let failureCount = 0;
		const deletedItems: PointSourceItem[] = [];

		for (const result of results) {
			if (isRejectedResult(result)) {
				failureCount++;
				continue;
			}

			deletedItems.push(result.value);
		}

		if (failureCount > 0)
			toaster.showUnhandledErrorMessage();

		this.setState(state => ({
			sources: state.sources.filter(item => !deletedItems.includes(item)),
			selectedItems: state.selectedItems.filter(item => !deletedItems.includes(item)),
			deleteTargets: [],
			deleteSubject: '',
			processing: false,
		}));
	};
}

const Wrapped = withAppUser(SourcesList);
export {Wrapped as SourcesList};
