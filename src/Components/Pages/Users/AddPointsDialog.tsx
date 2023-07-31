import {Button, Classes, Dialog, FormGroup, InputGroup, Intent, NumericInput} from '@blueprintjs/core';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {ItemRenderer, MultiSelect2 as MultiSelect} from '@blueprintjs/select';
import * as React from 'react';
import {PointSourceItem} from '../../../Api/Point-Tracking/Models/Sources';
import {ucwords} from '../../Utility/string';
import {DialogPointItem} from './UserEditor';
import * as toaster from '../../../Toaster';
import {Spacing} from '../../../Styles/variables';

interface IProps {
	sources: PointSourceItem[];
	processing: boolean;
	onClose: () => void;
	onSubmit: (dialogPointItem: DialogPointItem[]) => void;
}

interface IState {
	description: string;
	pointValue: number;
	sourceName: string;
	showCustomSourceForm: boolean;
	showSourceForm: boolean;
	selectedSources: PointSourceItem[];
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
			selectedSources: [],
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
							style={{marginRight: Spacing.Medium}}
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
								<MultiSelect
									tagInputProps={{
										inputProps: {
											autoFocus: true,
										},
									}}
									selectedItems={this.state.selectedSources}
									items={this.props.sources}
									onItemSelect={this.onSelectSourceItem}
									onRemove={this.onRemoveSourceItem}
									tagRenderer={this.tagItemRenderer}
									itemRenderer={this.selectItemRenderer}
									fill={true}
									popoverProps={{
										matchTargetWidth: true,
										minimal: true,
									}}
								/>
							</FormGroup>
						</form>
					)}

					{this.state.showCustomSourceForm && (
						<form>
							<FormGroup label="Name" labelInfo="(required)">
								<InputGroup
									value={this.state.sourceName}
									onChange={this.onSourceNameChange}
									autoFocus
								/>
							</FormGroup>

							<FormGroup label="Point Value" labelInfo="(required)">
								<NumericInput
									min={0}
									name="pointValue"
									onValueChange={this.onPointValueChange}
									value={this.state.pointValue}
									fill={true}
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
							disabled={this.state.sourceName.length === 0 || this.state.pointValue === 0}
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

	private onPointValueChange = (pointValue: number) => {
		if (isNaN(pointValue))
			return;

		this.setState({
			pointValue,
		})
	};

	private onSourceNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		sourceName: event.currentTarget.value,
	});

	private onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		description: event.currentTarget.value,
	});

	private onSubmitClick = () => {
		if (this.state.showSourceForm) {
			if (this.state.selectedSources.length === 0) {
				toaster.error('Please select a source.');

				return;
			}

			const dialogPointItems = this.state.selectedSources.map((source: PointSourceItem) => (
				{
					sourceName: source.name,
					pointValue: source.point_value,
				}),
			);

			this.props.onSubmit(dialogPointItems);

			return;
		}

		if (this.state.sourceName === '') {
			toaster.error('Please set a Source Name.');

			return;
		}

		this.props.onSubmit([
			{
				sourceName: this.state.sourceName,
				pointValue: this.state.pointValue,
				description: this.state.description,
			},
		]);
	};

	private selectItemRenderer: ItemRenderer<PointSourceItem> = (item, {handleClick, modifiers}) => {
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

	private tagItemRenderer = (item: PointSourceItem) => ucwords(item.name);

	private onSelectSourceItem = (item: PointSourceItem) => this.setState(state => {
		if (state.selectedSources.includes(item)) {
			return {
				selectedSources: state.selectedSources.filter(pointItem => pointItem !== item),
			};
		} else {
			return {
				selectedSources: [...state.selectedSources, item],
			};
		}
	});

	private onRemoveSourceItem = (item: PointSourceItem) => {
		this.setState(state => {
			return {
				selectedSources: state.selectedSources.filter(((filterItem) => filterItem !== item)),
			};
		});
	};
}