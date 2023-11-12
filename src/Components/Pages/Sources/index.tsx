import * as React from 'react';
import {
	Button,
	Classes,
	Dialog,
	FormGroup,
	HTMLTable,
	InputGroup,
	Intent,
	NumericInput,
} from '@blueprintjs/core';
import {PointSourceItem, PointSourceModel} from '../../../Api/Point-Tracking/Models/Sources';
import {UserContext} from '../../../Session';
import {toaster} from '../../../toaster';
import {DeleteDialog} from '../../DeleteDialog';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {replace} from '../../Utility/array';
import {AssignPointsDialog} from './AssignPointsDialog';
import {Classes as GmClasses} from '../../../classes';
import {ObjectList} from '../../ObjectList';
import {TableItem} from './TableItem';

interface IState {
	deleteTarget: PointSourceItem | null;
	isEditSource: boolean;
	selectedSource: PointSourceItem | null;
	showAsssignPointsDialog: boolean;
	sources: PointSourceItem[];
	sourceName: string;
	pointValue: number;
	showSourceDialog: boolean;
	loading: boolean;
	processing: boolean;
}

export class SourcesList extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		deleteTarget: null,
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
			sources = await PointSourceModel.list(this.context!.account.id).then(response => response.data);
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
					items={this.state.sources}
					title="Sources"
					editorUrlPrefix="/sources"
					onAddNewClick={this.onAddButtonClick}
					onItemFilter={this.onItemFilter}
				>
					{items => (
						<HTMLTable striped={true}>
							<thead>
								<tr>
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
										onDelete={this.onBeginDeleteButtonClick}
										processing={this.state.processing}
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
					isOpen={this.state.deleteTarget !== null}
					subject={this.state.deleteTarget?.name}
					onConfirm={this.onDeleteConfirm}
					onCancel={this.onDeleteCancel}
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

	private onItemFilter = (source: PointSourceItem, searchText: string): any => source.name.toLocaleLowerCase().includes(searchText);

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
			source = await PointSourceModel.set(this.context!.account.id, {
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

	private onBeginDeleteButtonClick = (item: PointSourceItem) => this.setState({
		deleteTarget: item,
	});

	private onDeleteCancel = () => this.setState({
		deleteTarget: null,
	});

	private onDeleteConfirm = async () => {
		if (this.state.processing)
			return;

		let target = this.state.deleteTarget;

		if (!target)
			return;

		this.setState({
			processing: true,
		});

		try {
			await PointSourceModel.delete(target.id);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				processing: false,
			});

			return;
		}

		this.setState(state => ({
			deleteTarget: null,
			sources: state.sources.filter(item => item !== target),
			processing: false,
		}));
	};
}
