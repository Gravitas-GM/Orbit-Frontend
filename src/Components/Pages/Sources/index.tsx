import {
	Button,
	Classes,
	Dialog,
	FormGroup,
	H2,
	HTMLTable,
	InputGroup,
	Intent, Menu, MenuItem,
	NumericInput, Popover,
} from '@blueprintjs/core';
import * as React from 'react';
import {PointSourceItem, PointSourceModel} from '../../../Api/Point-Tracking/Models/Sources';
import {UserContext} from '../../../Session';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {classNames} from '../../Utility/dom';
import {formatNumber, ucwords} from '../../Utility/string';
import {AssignPointsDialog} from './AssignPointsDialog';

interface IState {
	isEditSource: boolean;
	selectedSource: PointSourceItem | null;
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
		isEditSource: false,
		selectedSource: null,
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
			<>
				<div className={classNames('settings-title-container')}>
					<H2>Sources</H2>

					<Button
						text="Add"
						icon="plus"
						intent="primary"
						onClick={() => this.onAddButtonClick()}
					/>
				</div>

				<HTMLTable className={classNames('bp4-html-table-striped')}>
					<thead>
						<tr>
							<th>Name</th>
							<th>Value</th>
							<th>Edit</th>
						</tr>
					</thead>
					<tbody>
						{this.state.sources.map(source => (
							<tr key={`source-${source.id}`}>
								<td>{ucwords(source.name)}</td>
								<td>{formatNumber(source.point_value)}</td>
								<td>
									<Popover>
										<Button
											icon="cog"
											minimal={true}
										/>

										<Menu>
											<MenuItem
												text="Assign Points"
												icon="plus"
												onClick={() => this.onAssignPointsClick(source)}
											/>

											<MenuItem
												text="Edit"
												icon="edit"
												onClick={() => this.onEditClick(source)}
											/>

											<MenuItem
												text="Delete"
												icon="delete"
												intent={Intent.DANGER}
												onClick={() => this.onDeleteClick(source)}
											/>
										</Menu>
									</Popover>
								</td>
							</tr>
						))}
					</tbody>
				</HTMLTable>

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
									<InputGroup value={this.state.sourceName} onChange={this.onSourceNameChange} />
								</FormGroup>

								<FormGroup
									label="Point Value"
									labelFor="pointValue"
								>
									<NumericInput
										min={0}
										name="pointValue"
										onValueChange={this.onPointValueChange}
										value={this.state.pointValue}
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

				{this.state.selectedSource && (
					<AssignPointsDialog
						source={this.state.selectedSource}
						onClose={this.onAssignPointsDialogClose}
					/>
				)}
			</>
		);
	}

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
	});

	private onAssignPointsDialogClose = () => this.setState({
		selectedSource: null,
	});

	private onEditClick = (selectedSource: PointSourceItem) => this.setState({
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
			toaster.error('Please set a Source Name.');

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
			});

			return;
		}

		toaster.success(this.state.isEditSource ? 'Source edited.' : 'Source created.');

		this.setState(state => ({
			isEditSource: false,
			sources: [...state.sources, source].sort((a, b) => a.name.localeCompare(b.name)),
			showSourceDialog: false,
			sourceName: '',
			pointValue: 0,
			processing: false,
		}));
	};

	private onDeleteClick = async (source: PointSourceItem) => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		try {
			await PointSourceModel.delete(source.id);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				processing: false,
			});

			return;
		}

		this.setState(state => ({
			sources: state.sources.filter(item => item !== source),
			processing: false,
		}));
	};
}
