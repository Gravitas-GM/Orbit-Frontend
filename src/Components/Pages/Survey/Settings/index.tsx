import * as React from 'react';
import {FormEvent} from 'react';
import {Button, Intent, Switch} from '@blueprintjs/core';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {ItemRenderer} from '@blueprintjs/select';
import {Prompt} from 'react-router';
import {isValidationFailureError, ValidationFailures} from '../../../../Api/errors/symfony';
import {DayOfWeek, Settings, SettingsModel} from '../../../../Api/Survey/Models/Settings';
import {Classes} from '../../../../classes';
import {history} from '../../../../history';
import {UserContext} from '../../../../Session';
import {toaster} from '../../../../toaster';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {PageHeader} from '../../../PageHeader';
import {Select} from '../../../Select/Select';
import {ucwords} from '../../../Utility/string';
import {ValidationAwareFormGroup} from '../../../ValidationAwareFormGroup';

interface IState {
	loading: boolean;
	processing: boolean;
	failures: ValidationFailures | null;
	surveyRefreshDay: DayOfWeek;
	userSurveyReminder: boolean;
	dirty: boolean;
}

export class SurveySettings extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public readonly state: IState = {
		loading: true,
		processing: false,
		failures: null,
		surveyRefreshDay: DayOfWeek.MONDAY,
		userSurveyReminder: false,
		dirty: false,
	};

	public async componentDidMount() {
		let settings: Settings;

		try {
			settings = await SettingsModel.read(this.context!.account.id).then(r => r.data);
		} catch (error) {
			toaster.error('Failed to load survey settings.');
			history.push('/');

			return;
		}

		this.setState({
			loading: false,
			surveyRefreshDay: settings.surveyRefreshDay,
			userSurveyReminder: settings.userSurveyReminder,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<section className={Classes.PAGE_WRAPPER}>
				<PageHeader title="Survey Settings" />

				<form onSubmit={this.onSaveButtonClick} style={{maxWidth: 800}}>
					<ValidationAwareFormGroup
						label="Survey Refresh Day"
						labelFor="surveyRefreshDay"
						failures={this.state.failures}
					>
						<Select
							items={Object.values(DayOfWeek)}
							onItemSelect={this.onRefreshDayChange}
							filterable={false}
							itemRenderer={this.renderDayOfWeekItem}
							fill={true}
						>
							<Button
								fill={true}
								text={ucwords(this.state.surveyRefreshDay)}
								rightIcon="caret-down"
								placeholder="Select survey refresh day"
								alignText="left"
							/>
						</Select>
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup
						labelFor="userSurveyReminder"
						failures={this.state.failures}
					>
						<div className="settings-switch-container">
							<span>
								Notify Users On New Surveys
							</span>

							<Switch
								checked={this.state.userSurveyReminder}
								onChange={this.onUserSurveyReminderChange}
								large={true}
								inline={true}
							/>
						</div>

						<div className={Classes.FORM_GROUP_SUB_LABEL}>
							When enabled, users will receive notificaion emails when a new survey is available.
						</div>
					</ValidationAwareFormGroup>

					<Button loading={this.state.processing} type="submit" intent={Intent.PRIMARY} text="Save" />
				</form>

				<Prompt when={this.state.dirty} message="You have unsaved changes. Are you sure you want to leave?" />
			</section>
		);
	}

	private onRefreshDayChange = (surveyRefreshDay: DayOfWeek) => this.setState({
		surveyRefreshDay,
		dirty: true,
	});

	private onUserSurveyReminderChange = (event: FormEvent<HTMLInputElement>) => this.setState({
		userSurveyReminder: event.currentTarget.checked,
		dirty: true,
	});

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
				surveyRefreshDay: this.state.surveyRefreshDay,
				userSurveyReminder: this.state.userSurveyReminder,
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

		toaster.success('Survey settings saved.');
	};

	private renderDayOfWeekItem: ItemRenderer<DayOfWeek> = (item, {handleClick, handleFocus, modifiers}) => (
		<MenuItem
			key={item}
			text={ucwords(item)}
			selected={item === this.state.surveyRefreshDay}
			active={modifiers.active}
			disabled={modifiers.disabled}
			onClick={handleClick}
			onFocus={handleFocus}
			roleStructure="listoption"
		/>
	);
}
