import * as React from 'react';
import {Button, InputGroup, Intent} from '@blueprintjs/core';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {ValidationAwareFormGroup} from '../../../ValidationAwareFormGroup';
import {PageHeader} from '../../../PageHeader';
import {isValidationFailureError, ValidationFailures} from '../../../../Api/errors/symfony';
import {ItemRenderer} from '@blueprintjs/select';
import {Select} from '../../../Select/Select';
import {ucwords} from '../../../Utility/string';
import {Frequency, Settings, SettingsModel} from '../../../../Api/Quiz/Models/Settings';
import {UserContext} from '../../../../Session';
import {PointSourceItem, PointSourceModel} from '../../../../Api/Point-Tracking/Models/Sources';
import * as toaster from '../../../../Toaster';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {history} from '../../../../history';
import {Classes} from '../../../../classes';

interface IState {
	loading: boolean;
	processing: boolean;
	failures: ValidationFailures | null;
	pointSources: PointSourceItem[];
	frequency: Frequency;
	questionCount: string;
	completedRewardSource: PointSourceItem | null;
}

export class QuizSettings extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public readonly state: IState = {
		loading: true,
		processing: false,
		failures: null,
		pointSources: [],
		frequency: Frequency.Weekly,
		questionCount: '',
		completedRewardSource: null,
	};

	public async componentDidMount() {
		let data: [PointSourceItem[], Settings];

		try {
			data = await Promise.all([
				PointSourceModel.list(this.context!.account.id).then(r => r.data),
				SettingsModel.read(this.context!.account.id).then(r => r.data),
			]);
		} catch (error) {
			toaster.error('Failed to load quiz settings.');
			history.push('/');

			return;
		}

		const [sources, settings] = data;

		this.setState({
			loading: false,
			pointSources: sources,
			frequency: settings.quizFrequency,
			questionCount: settings.questionCount.toString(10),
			completedRewardSource: sources.find(item => item.id.$oid === settings.completedRewardPointSourceId) ?? null,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<section className={Classes.PAGE_WRAPPER}>
				<PageHeader title="Quiz Settings" />

				<form onSubmit={this.onSaveButtonClick} style={{maxWidth: 800}}>
					<ValidationAwareFormGroup
						label="Quiz Frequency"
						labelFor="quizFrequency"
						failures={this.state.failures}
					>
						<div className={Classes.FORM_GROUP_SUB_LABEL}>
							How often a user is allowed to take a quiz.
						</div>

						<Select
							items={Object.values(Frequency)}
							onItemSelect={this.onFrequencyChange}
							filterable={false}
							itemRenderer={this.renderFrequencyItem}
							fill={true}
						>
							<Button
								fill={true}
								text={ucwords(this.state.frequency)}
								rightIcon="caret-down"
								placeholder="Select quiz frequency"
								alignText="left"
							/>
						</Select>
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup
						label="Question Count"
						labelFor="questionCount"
						failures={this.state.failures}
					>
						<div className={Classes.FORM_GROUP_SUB_LABEL}>
							The number of questions to select for each quiz.
						</div>

						<InputGroup
							fill={true}
							id="questionCount"
							name="questionCount"
							value={this.state.questionCount}
							onChange={this.onQuestionCountChange}
						/>
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup
						label="Reward Point Source"
						labelFor="quizRewardSource"
						failures={this.state.failures}
					>
						<div className={Classes.FORM_GROUP_SUB_LABEL}>
							The Point Source to grant to a user upon quiz completion.
						</div>

						<Select
							items={this.state.pointSources}
							onItemSelect={this.onRewardSourceChange}
							filterable={false}
							itemRenderer={this.renderPointSourceItem}
							onClear={this.onRewardSourceClear}
							fill={true}
							noResults={(
								<MenuItem
									disabled={true}
									text="No results."
									roleStructure="listoption"
								/>
							)}
						>
							<Button
								fill={true}
								text={this.state.completedRewardSource?.name ?? 'None'}
								rightIcon="caret-down"
								alignText="left"
							/>
						</Select>
					</ValidationAwareFormGroup>

					<Button loading={this.state.processing} type="submit" intent={Intent.PRIMARY} text="Save" />
				</form>
			</section>
		);
	}

	private onRewardSourceClear = () => this.setState({
		completedRewardSource: null,
	});

	private onQuestionCountChange = (event: React.FormEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value;

		if (value.length === 0) {
			this.setState({
				questionCount: '',
			});

			return;
		}

		const parsed = parseInt(value, 10);

		if (isNaN(parsed))
			return;

		this.setState({
			questionCount: parsed.toString(10),
		});
	};

	private onRewardSourceChange = (source: PointSourceItem) => this.setState({
		completedRewardSource: source,
	});

	private onFrequencyChange = (frequency: Frequency) => {
		this.setState({
			frequency,
		});
	};

	private onSaveButtonClick = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (this.state.processing)
			return;

		this.setState({
			processing: true,
			failures: null,
		});

		try {
			await SettingsModel.update(this.context!.account.id, {
				quizFrequency: this.state.frequency,
				questionCount: this.state.questionCount.length > 0 ? parseInt(this.state.questionCount, 10) : 0,
				completedRewardPointSourceId: this.state.completedRewardSource?.id.$oid ?? null,
			});
		} catch (error) {
			if (isValidationFailureError(error)) {
				toaster.showValidationFailedErrorMessage();

				this.setState({
					failures: error.context.failures,
				});
			} else
				toaster.showUnhandledErrorMessage();

			return;
		} finally {
			this.setState({
				processing: false,
			});
		}

		toaster.success('Quiz settings saved.');
	};

	private renderFrequencyItem: ItemRenderer<Frequency> = (item, {handleClick, handleFocus, modifiers}) => (
		<MenuItem
			key={item}
			text={ucwords(item)}
			selected={item === this.state.frequency}
			active={modifiers.active}
			disabled={modifiers.disabled}
			onClick={handleClick}
			onFocus={handleFocus}
			roleStructure="listoption"
		/>
	);

	private renderPointSourceItem: ItemRenderer<PointSourceItem> = (item, {handleClick, handleFocus, modifiers}) => {
		if (!modifiers.matchesPredicate)
			return null;

		return (
			<MenuItem
				key={item.id.$oid}
				text={item.name}
				selected={item === this.state.completedRewardSource}
				active={modifiers.active}
				disabled={modifiers.disabled}
				onClick={handleClick}
				onFocus={handleFocus}
				roleStructure="listoption"
			/>
		);
	};
}
