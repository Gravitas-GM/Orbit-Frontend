import {Button, InputGroup, Intent, MenuItem, NumericInput, Switch} from '@blueprintjs/core';
import {ItemRenderer} from '@blueprintjs/select';
import * as React from 'react';
import {Navigate} from 'react-router-dom';
import {isValidationFailureError, ValidationFailures} from '../../../api/errors/symfony';
import {PointSourceItem, PointSourceModel} from '../../../api/Point-Tracking/Models/Sources';
import {Frequency, Settings, SettingsModel} from '../../../api/Quiz/Models/Settings';
import {Classes} from '../../../classes';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {PageHeader} from '../../../components/PageHeader';
import {Prompt} from '../../../components/Router/Prompt';
import {Select} from '../../../components/Select/Select';
import {ValidationAwareFormGroup} from '../../../components/ValidationAwareFormGroup';
import {withAppUser, WithAppUserProps} from '../../../contexts/SessionContext';
import {Spacing} from '../../../Styles/variables';
import {toaster} from '../../../toaster';
import {ucwords} from '../../../utility/string';

const DEFAULT_QUIZ_DURATION_MINUTES = 10;

interface State {
	loading: boolean,
	processing: boolean,
	failures: ValidationFailures | null,
	pointSources: PointSourceItem[],
	frequency: Frequency,
	questionCount: string,
	completedRewardSource: PointSourceItem | null,
	quizDurationMinutes: number | null,
	dirty: boolean,
	redirect: string | null,
}

class QuizSettings extends React.PureComponent<WithAppUserProps, State> {
	public readonly state: State = {
		loading: true,
		processing: false,
		failures: null,
		pointSources: [],
		frequency: Frequency.Weekly,
		questionCount: '',
		completedRewardSource: null,
		quizDurationMinutes: DEFAULT_QUIZ_DURATION_MINUTES,
		dirty: false,
		redirect: null,
	};

	public async componentDidMount() {
		let data: [PointSourceItem[], Settings];

		try {
			data = await Promise.all([
				PointSourceModel.list(this.props.user.account.id).then(r => r.data),
				SettingsModel.read(this.props.user.account.id).then(r => r.data),
			]);
		} catch (error) {
			toaster.error('Failed to load quiz settings.');
			this.setState({
				redirect: '/',
			});

			return;
		}

		const [sources, settings] = data;

		this.setState({
			loading: false,
			pointSources: sources,
			frequency: settings.quizFrequency,
			questionCount: settings.questionCount.toString(10),
			completedRewardSource: sources.find(item => item.id.$oid === settings.completedRewardPointSourceId) ?? null,
			quizDurationMinutes: settings.quizDurationSeconds ? settings.quizDurationSeconds / 60 : null,
		});
	}

	public render() {
		if (this.state.redirect)
			return <Navigate to={this.state.redirect} />;
		else if (this.state.loading)
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
								alignText="left"
							/>
						</Select>
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup
						labelFor="quizDurationSeconds"
						failures={this.state.failures}
					>
						<div className="settings-switch-container">
							<span>
								Quiz Timer
							</span>

							<Switch
								checked={this.state.quizDurationMinutes !== null}
								onChange={this.onUseDurationChange}
								large={true}
								inline={true}
							/>
						</div>

						<span>
							When enabled, a quiz will be automatically submitted when the timer expires.
						</span>

						{this.state.quizDurationMinutes && (
							<div style={{paddingTop: Spacing.Medium}}>
								<div className={Classes.FORM_GROUP_SUB_LABEL}>
									The duration of the quiz (in minutes).
								</div>

								<NumericInput
									min={1}
									fill={true}
									name="quizDurationSeconds"
									onValueChange={this.onQuizDurationMinutesChange}
									value={this.state.quizDurationMinutes}
								/>
							</div>
						)}
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup
						label="Question Count"
						labelFor="questionCount"
						failures={this.state.failures}
						style={{paddingTop: Spacing.Medium}}
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
						style={{paddingTop: Spacing.Medium}}
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

				<Prompt when={this.state.dirty} message="You have unsaved changes. Are you sure you want to leave?" />
			</section>
		);
	}

	private onRewardSourceClear = () => this.setState({
		completedRewardSource: null,
	});

	private onUseDurationChange = () => this.setState(state => ({
		quizDurationMinutes: state.quizDurationMinutes ? null : DEFAULT_QUIZ_DURATION_MINUTES,
	}));

	private onQuizDurationMinutesChange = (quizDurationMinutes: number) => {
		if (isNaN(quizDurationMinutes) || quizDurationMinutes < 1)
			return;

		this.setState({
			quizDurationMinutes,
		});
	};

	private onQuestionCountChange = (event: React.FormEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value;

		if (value.length === 0) {
			this.setState({
				questionCount: '',
				dirty: true,
			});

			return;
		}

		const parsed = parseInt(value, 10);

		if (isNaN(parsed))
			return;

		this.setState({
			questionCount: parsed.toString(10),
			dirty: true,
		});
	};

	private onRewardSourceChange = (source: PointSourceItem) => this.setState({
		completedRewardSource: source,
		dirty: true,
	});

	private onFrequencyChange = (frequency: Frequency) => {
		this.setState({
			frequency,
			dirty: true,
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
			await SettingsModel.update(this.props.user.account.id, {
				quizFrequency: this.state.frequency,
				questionCount: this.state.questionCount.length > 0 ? parseInt(this.state.questionCount, 10) : 0,
				completedRewardPointSourceId: this.state.completedRewardSource?.id.$oid ?? null,
				quizDurationSeconds: this.state.quizDurationMinutes ? this.state.quizDurationMinutes * 60 : null,
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
				dirty: false,
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

const Wrapped = withAppUser(QuizSettings);
export {Wrapped as QuizSettings};
