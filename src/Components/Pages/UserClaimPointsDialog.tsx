import {Button, Classes, Dialog, FormGroup, Intent, MenuItem} from '@blueprintjs/core';
import {ItemRenderer, MultiSelect2 as MultiSelect} from '@blueprintjs/select';
import * as React from 'react';
import {PointsModel} from '../../Api/Point-Tracking/Models/Points';
import {PointSourceItem, PointSourceModel} from '../../Api/Point-Tracking/Models/Sources';
import {UserContext} from '../../Session';
import {FrameLoadingSpinner} from '../FrameLoadingSpinner';
import {allSettled} from '../Utility/promise';
import {ucwords} from '../Utility/string';
import * as toaster from '../../Toaster';

interface IProps {
	onClose: () => void;
	isOpen: boolean;
}

interface IState {
	sources: PointSourceItem[];
	selectedSources: PointSourceItem[];
	loading: boolean;
	processing: boolean;
}

export class UserClaimPointsDialog extends React.PureComponent<IProps, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public constructor(props: IProps) {
		super(props);

		this.state = {
			selectedSources: [],
			sources: [],
			loading: true,
			processing: false,
		};
	}

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
		return (
			<Dialog onClose={this.props.onClose} isOpen={this.props.isOpen} title="Add Points">
				<div className={Classes.DIALOG_BODY}>
					{this.state.loading ? <FrameLoadingSpinner /> : (
						<form>
							<FormGroup
								label="Select Point Sources"
								labelFor="selectedSources"
								style={{display: 'flex'}}
							>
								<MultiSelect
									selectedItems={this.state.selectedSources}
									items={this.state.sources}
									onItemSelect={this.onSourceSelect}
									onRemove={this.onSourceRemove}
									tagRenderer={this.tagRenderer}
									itemRenderer={this.selectItemRenderer}
									fill={true}
									popoverProps={{
										matchTargetWidth: true,
										minimal: true,
									}}
								/>

								<div style={{paddingTop: 10}}>
									<Button
										text="Clear"
										icon="minus"
										onClick={this.onClearClick}
									/>
								</div>
							</FormGroup>
						</form>
					)}
				</div>

				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button text="Cancel" onClick={this.props.onClose} disabled={this.state.processing} />

						<Button
							intent={Intent.PRIMARY}
							text="Submit"
							onClick={this.onSubmit}
							loading={this.state.processing}
							disabled={this.state.selectedSources.length === 0}
						/>
					</div>
				</div>
			</Dialog>
		);
	}

	private onSourceSelect = (source: PointSourceItem) => this.setState(state => {
		if (state.selectedSources.includes(source)) {
			return {
				selectedSources: state.selectedSources.filter(item => item !== source),
			};
		} else {
			return {
				selectedSources: [...state.selectedSources, source],
			};
		}
	});

	private onSourceRemove = (source: PointSourceItem) => this.setState(state => ({
		selectedSources: state.selectedSources.filter(item => item !== source),
	}));

	private onClearClick = () => this.setState({
		selectedSources: [],
	});

	private onSubmit = async (event: React.SyntheticEvent<any>) => {
		event.preventDefault();

		if (this.state.processing || this.state.selectedSources.length === 0)
			return;

		this.setState({
			processing: true,
		});

		try {
			await allSettled(this.state.selectedSources.map(async source => {
				try {
					await PointsModel.create(this.context!.id, {
						timestamp: new Date(),
						point_value: source.point_value,
						source: source.name,
					});
				} catch (error) {
					toaster.error(`Failed claiming points for ${ucwords(source.name)}.`);

					throw error;
				}
			}));
		} catch (_) {
			this.setState({
				processing: false,
			});

			this.props.onClose();

			return;
		}

		toaster.success(
			'Points claimed.',
		);

		this.setState({
			processing: false,
		});

		this.props.onClose();
	};

	private tagRenderer = (source: PointSourceItem) => {
		return ucwords(source.name);
	}

	private selectItemRenderer: ItemRenderer<PointSourceItem> = (item, { handleClick, modifiers}) => {
		if (!modifiers.matchesPredicate) {
			return null;
		}

		return (
			<MenuItem
				active={modifiers.active}
				key={item.id.$oid}
				text={ucwords(item.name)}
				onClick={handleClick}
			/>
		);
	};
}
