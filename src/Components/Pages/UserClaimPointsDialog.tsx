import {Button, Classes, Dialog, FormGroup, Intent, MenuItem} from '@blueprintjs/core';
import {ItemRenderer, Select2} from '@blueprintjs/select';
import * as React from 'react';
import {User, UserModel} from '../../Api/Hub/Models/Users';
import {PointsModel} from '../../Api/Point-Tracking/Models/Points';
import {PointSourceItem, PointSourceModel} from '../../Api/Point-Tracking/Models/Sources';
import {UserContext} from '../../Session';
import {FrameLoadingSpinner} from '../FrameLoadingSpinner';
import {ucwords} from '../Utility/string';
import * as toaster from '../../Toaster';

interface IProps {
	onClose: () => void;
}

interface IState {
	selectedSource: PointSourceItem | null;
	user: User | null;
	sources: PointSourceItem[];
	loading: boolean;
	processing: boolean;
}

export class UserClaimPointsDialog extends React.PureComponent<IProps, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public constructor(props: IProps) {
		super(props);

		this.state = {
			selectedSource: null,
			user: null,
			sources: [],
			loading: true,
			processing: false,
		}
	}

	public async componentDidMount() {
		let user: User;

		try {
			user = await UserModel.read(this.context!.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			return;
		}

		let sources: PointSourceItem[] = [];

		try {
			sources = await PointSourceModel.list(this.context!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();
		}

		this.setState({
			user,
			sources: sources.sort((a, b) => a.name.localeCompare(b.name)),
			loading: false,
		});
	}

	public render() {
		return (
			<Dialog onClose={this.props.onClose} isOpen={true} title="Add Points">
				<div className={Classes.DIALOG_BODY}>
					{this.state.loading ? <FrameLoadingSpinner /> : (
						<form>
							<FormGroup
								label="Source"
							>
								<Select2
									items={this.state.sources}
									itemRenderer={this.selectItemRenderer}
									onItemSelect={this.onSelectedSourceChange}
									filterable={false}
									fill={true}
									popoverProps={{
										matchTargetWidth: true,
										minimal: true,
									}}
								>
									<Button
										text={(
											this.state.selectedSource?.name
												? ucwords(this.state.selectedSource.name)
												: 'Select a Source'
										)}
										rightIcon="caret-down"
										fill={true}
										alignText="left"
									/>
								</Select2>
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
							onClick={this.onSubmitClick}
							loading={this.state.processing}
						/>
					</div>
				</div>
			</Dialog>
		);
	}

	private onSelectedSourceChange = (selectedSource: PointSourceItem) => this.setState({
		selectedSource,
	});

	private onSubmitClick = async () => {
		if (this.state.processing || !this.state.selectedSource)
			return;

		this.setState({
			processing: true,
		});

		try {
			await PointsModel.create(this.state.user!.id, {
				timestamp: new Date(),
				point_value: this.state.selectedSource.point_value,
				source: this.state.selectedSource.name,
			}).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				processing: false,
			});

			return;
		}

		toaster.success(
			'Points added.',
		);

		this.setState({
			processing: false,
		});

		this.props.onClose();
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
