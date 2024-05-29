import {Button, Classes, Dialog, FormGroup, Intent} from '@blueprintjs/core';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {ItemRenderer} from '@blueprintjs/select';
import * as React from 'react';
import {User} from '../Api/Hub/Models/Users';
import {PointsModel} from '../Api/Point-Tracking/Models/Points';
import {PointSourceItem, PointSourceModel} from '../Api/Point-Tracking/Models/Sources';
import {SessionContext, useAppUser} from '../contexts/SessionContext';
import {toaster} from '../toaster';
import {allSettled} from '../utility/promise';
import {ucwords} from '../utility/string';
import {FrameLoadingSpinner} from './FrameLoadingSpinner';
import {MultiSelect} from './Select/MultiSelect';

interface Props {
	onClose: () => void,
	isOpen: boolean,
}

export function UserClaimPointsDialog(props: Props): React.ReactElement | null {
	const user = useAppUser();

	if (!user)
		return null;

	return <UserClaimPointsDialogInner user={user} {...props} />;
}

interface InnerProps extends Props {
	user: User,
}

interface State {
	sources: PointSourceItem[];
	selectedSources: PointSourceItem[];
	loading: boolean;
	processing: boolean;
}

export class UserClaimPointsDialogInner extends React.PureComponent<InnerProps, State> {
	public static contextType = SessionContext;
	declare context: React.ContextType<typeof SessionContext>;

	public state: Readonly<State> = {
		selectedSources: [],
		sources: [],
		loading: true,
		processing: false,
	};

	public async componentDidMount() {
		let sources: PointSourceItem[] = [];

		try {
			sources = await PointSourceModel.list(this.props.user.account.id).then(r => r.data);
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
			<Dialog
				onClose={this.props.onClose}
				isOpen={this.props.isOpen}
				title="Claim Points"
				canOutsideClickClose={false}
			>
				<div className={Classes.DIALOG_BODY}>
					{this.state.loading ? <FrameLoadingSpinner /> : (
						<form onSubmit={this.onSubmit}>
							<FormGroup
								label="Select sources to claim points for"
								labelFor="selectedSources"
								style={{display: 'flex'}}
							>
								<MultiSelect
									tagInputProps={{
										inputProps: {
											autoFocus: true,
										},
									}}
									selectedItems={this.state.selectedSources}
									items={this.state.sources}
									onItemSelect={this.onSourceSelect}
									onRemove={this.onSourceRemove}
									onClear={this.onSourcesClear}
									tagRenderer={this.tagRenderer}
									itemRenderer={this.selectItemRenderer}
								/>
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

	private onSourceRemove = (source: PointSourceItem) => this.setState(state => (
		{
			selectedSources: state.selectedSources.filter(item => item !== source),
		}
	));

	private onSourcesClear = () => this.setState({
		selectedSources: [],
	});

	private onSubmit = async (event: React.SyntheticEvent) => {
		event.preventDefault();

		if (this.state.processing || this.state.selectedSources.length === 0)
			return;

		this.setState({
			processing: true,
		});

		let failedCount = 0;

		try {
			await allSettled(this.state.selectedSources.map(async source => {
				try {
					await PointsModel.create(this.props.user.id, {
						timestamp: new Date(),
						point_value: source.point_value,
						source: source.name,
					});
				} catch (error) {
					failedCount += 1;

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

		if (failedCount === 0)
			toaster.success('Points claimed.');
		else if (failedCount < this.state.selectedSources.length)
			toaster.error('Some points could not be claimed.');
		else if (failedCount === this.state.selectedSources.length)
			toaster.error('No points could be claimed');

		this.setState({
			processing: false,
			selectedSources: [],
		});

		this.props.onClose();
	};

	private tagRenderer = (source: PointSourceItem) => {
		return ucwords(source.name);
	};

	private selectItemRenderer: ItemRenderer<PointSourceItem> = (
		item,
		{
			handleClick,
			modifiers,
		},
	) => {
		if (!modifiers.matchesPredicate) {
			return null;
		}

		return (
			<MenuItem
				active={modifiers.active}
				key={item.id.$oid}
				text={`${ucwords(item.name)} (${item.point_value} points)`}
				onClick={handleClick}
			/>
		);
	};
}
