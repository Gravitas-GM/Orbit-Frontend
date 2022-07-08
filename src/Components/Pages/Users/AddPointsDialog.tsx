import {Button, Classes, Dialog, FormGroup, InputGroup, Intent, MenuItem, NumericInput} from '@blueprintjs/core';
import {ItemRenderer, Select} from '@blueprintjs/select';
import * as React from 'react';
import {PointSourceItem} from '../../../Api/Point-Tracking/Models/Sources';
import {ucwords} from '../../Utility/string';
import {DialogPointItem} from './UserEditor';
import * as toaster from '../../../Toaster';

interface IProps {
	sources: PointSourceItem[];
	processing: boolean;
	onClose: () => void;
	onSubmit: (dialogPointItem: DialogPointItem) => void;
}

interface IState {
	description: string;
	pointValue: number;
	sourceName: string;
	showCustomSourceForm: boolean;
	showSourceForm: boolean;
	selectedSource: PointSourceItem | null;
}

export class AddPointsDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			description: '',
			pointValue: 0,
			sourceName: '',
			showCustomSourceForm: false,
			showSourceForm: false,
			selectedSource: null,
		};
	}

	public render() {
		return (
			<Dialog onClose={this.props.onClose} isOpen={true} title="Add Points">
				<div className={Classes.DIALOG_BODY}>
					<div style={{display: 'flex', justifyContent: 'center', paddingBottom: 15}}>
						<Button
							intent={Intent.SUCCESS}
							text="Preset Source"
							onClick={this.onShowSourceFormClick}
							disabled={this.props.processing}
							style={{marginRight: 10}}
						/>

						<Button
							intent={Intent.SUCCESS}
							text="Custom Source"
							onClick={this.onShowCustomSourceFormClick}
							disabled={this.props.processing}
						/>
					</div>

					{this.state.showSourceForm && (
						<form>
							<FormGroup
								label="Source"
							>
								<Select
									items={this.props.sources}
									itemRenderer={this.selectItemRenderer}
									onItemSelect={this.onSelectedSourceChange}
									filterable={false}
								>
									<Button
										text={(
											this.state.selectedSource?.name
												? ucwords(this.state.selectedSource.name)
												: 'Select a Source'
										)}
										rightIcon="caret-down"
									/>
								</Select>
							</FormGroup>
						</form>
					)}

					{this.state.showCustomSourceForm && (
						<form>
							<FormGroup label="Name">
								<InputGroup value={this.state.sourceName} onChange={this.onSourceNameChange} />
							</FormGroup>

							<FormGroup label="Point Value">
								<NumericInput
									min={0}
									name="pointValue"
									onValueChange={this.onPointValueChange}
									value={this.state.pointValue}
								/>
							</FormGroup>

							<FormGroup label="Description">
								<InputGroup value={this.state.description} onChange={this.onDescriptionChange} />
							</FormGroup>
						</form>
					)}
				</div>

				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button text="Cancel" onClick={this.props.onClose} disabled={this.props.processing} />

						<Button
							intent={Intent.PRIMARY}
							text="Submit"
							onClick={this.onSubmitClick}
							loading={this.props.processing}
						/>
					</div>
				</div>
			</Dialog>
		);
	}

	private onShowCustomSourceFormClick = () => this.setState({
		showCustomSourceForm: true,
		showSourceForm: false,
	});

	private onShowSourceFormClick = () => this.setState({
		showCustomSourceForm: false,
		showSourceForm: true,
	});

	private onSelectedSourceChange = (selectedSource: PointSourceItem) => this.setState({
		selectedSource,
	});

	private onPointValueChange = (pointValue: number) => this.setState({
		pointValue,
	});

	private onSourceNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		sourceName: event.currentTarget.value,
	});

	private onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		description: event.currentTarget.value,
	});

	private onSubmitClick = () => {
		if (this.state.showSourceForm) {
			if (!this.state.selectedSource) {
				toaster.error('Please select a source.');

				return;
			}

			this.props.onSubmit({
				sourceName: this.state.selectedSource.name,
				pointValue: this.state.selectedSource.point_value,
			});

			return;
		}

		if (this.state.sourceName === '') {
			toaster.error('Please set a Source Name.');

			return;
		}

		this.props.onSubmit({
			sourceName: this.state.sourceName,
			pointValue: this.state.pointValue,
			description: this.state.description,
		});
	};

	private selectItemRenderer: ItemRenderer<PointSourceItem> = (item, { handleClick, modifiers}) => {
		if (!modifiers.matchesPredicate) {
			return null;
		}

		return (
			<MenuItem
				active={modifiers.active}
				key={`selectItem-${item.id.$oid}`}
				text={ucwords(item.name)}
				onClick={handleClick}
			/>
		);
	};
}
