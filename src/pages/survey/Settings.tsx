import {Button, MenuItem, Switch} from '@blueprintjs/core';
import {ItemRenderer} from '@blueprintjs/select';
import {ChangeEventHandler, PureComponent, ReactElement} from 'react';
import {WEEK_DAY_NAMES, WEEK_DAY_VALUES, WeekDay} from '../../api';
import {ApiError, ValidationFailures} from '../../api/errors/symfony';
import {SettingsModel} from '../../api/Survey/Models/Settings';
import {Classes} from '../../classes';
import {FormControls} from '../../components/FormControls';
import {FrameLoadingSpinner} from '../../components/FrameLoadingSpinner';
import {PageHeader} from '../../components/PageHeader';
import {ItemSelectFn, Select} from '../../components/Select/Select';
import {ValidationAwareFormGroup} from '../../components/ValidationAwareFormGroup';
import {withAppUser, WithAppUserProps} from '../../contexts/SessionContext';
import {toaster} from '../../toaster';

interface State {
	refreshDay: WeekDay,
	surveyReminderEnabled: boolean,
	validation: ValidationFailures | null,
	dirty: boolean,
	loading: boolean,
	saving: boolean,
}

class Settings extends PureComponent<WithAppUserProps, State> {
	public state: Readonly<State> = {
		refreshDay: WeekDay.Sunday,
		surveyReminderEnabled: false,
		validation: null,
		dirty: false,
		loading: true,
		saving: false,
	};

	public async componentDidMount(): Promise<void> {
		try {
			const settings = await SettingsModel.read(this.props.user.account.id).then(r => r.data);

			this.setState({
				refreshDay: settings.surveyRefreshDay,
				surveyReminderEnabled: settings.userSurveyReminder,
			});
		} catch (error) {
			toaster.showApiErrorMessage(error);
			return;
		}

		this.setState({
			loading: false,
		});
	}

	public render(): ReactElement {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<div className={Classes.PAGE_WRAPPER}>
				<PageHeader title="Survey Settings" />

				<form style={{width: '100%', maxWidth: 800}}>
					<ValidationAwareFormGroup label="Survey Reset Day" labelFor="surveyRefreshDay" failures={null}>
						<Select
							items={WEEK_DAY_VALUES}
							itemRenderer={this.renderWeekDayItem}
							onItemSelect={this.onRefreshDaySelect}
							fill={true}
						>
							<Button
								rightIcon="caret-down"
								text={WEEK_DAY_NAMES[this.state.refreshDay]}
								alignText="left"
								fill={true}
							/>
						</Select>
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup
						labelFor="userSurveyReminder"
						failures={this.state.validation}
					>
						<div className={Classes.SWITCH_CONTAINER}>
							<span>Notify users when a new survey is available</span>

							<Switch
								checked={this.state.surveyReminderEnabled}
								onChange={this.onSurveyReminderChange}
								large={true}
								inline={true}
							/>
						</div>
					</ValidationAwareFormGroup>

					<FormControls
						onSaveClick={this.onSave}
						loading={this.state.saving}
						dirty={this.state.dirty}
						redirectPath="/"
					/>
				</form>
			</div>
		);
	}

	private renderWeekDayItem: ItemRenderer<WeekDay> = (item, props) => (
		<MenuItem
			key={item}
			text={WEEK_DAY_NAMES[item]}
			selected={item === this.state.refreshDay}
			active={props.modifiers.active}
			disabled={props.modifiers.disabled}
			onClick={props.handleClick}
			onFocus={props.handleFocus}
			roleStructure="listoption"
		/>
	);

	private onRefreshDaySelect: ItemSelectFn<WeekDay> = item => this.setState({
		refreshDay: item,
		dirty: true,
	});

	private onSurveyReminderChange: ChangeEventHandler<HTMLInputElement> = event => this.setState({
		surveyReminderEnabled: event.currentTarget.checked,
		dirty: true,
	});

	private onSave = async () => {
		if (this.state.saving)
			return;

		this.setState({
			saving: true,
		});

		try {
			await SettingsModel.update(this.props.user.account.id, {
				userSurveyReminder: this.state.surveyReminderEnabled,
				surveyRefreshDay: this.state.refreshDay,
			});
		} catch (error) {
			if (error instanceof ApiError && error.isValidationFailure()) {
				this.setState({
					validation: error.context.failures,
				});
			} else {
				this.setState({
					validation: null,
				});
			}

			toaster.showApiErrorMessage(error);

			return;
		} finally {
			this.setState({
				saving: false,
			});
		}

		toaster.success('Settings saved.');
	};
}

const Wrapped = withAppUser(Settings);
export {Wrapped as Settings};
