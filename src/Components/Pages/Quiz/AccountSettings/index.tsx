import * as React from 'react';
import { Button, InputGroup, Intent, MenuItem } from "@blueprintjs/core";
import { ValidationAwareFormGroup } from "../../../ValidationAwareFormGroup";
import { PageHeader } from "../../../PageHeader";
import { ValidationFailures, isValidationFailureError } from "../../../../Api/errors/symfony";
import { Select2 as Select, ItemRenderer } from "@blueprintjs/select";
import { ucwords } from "../../../Utility/string";
import { Account, AccountModel, Frequency } from "../../../../Api/Quiz/Models/Accounts";
import { UserContext } from "../../../../Session";
import { PointSourceItem, PointSourceModel } from "../../../../Api/Point-Tracking/Models/Sources";
import * as toaster from "../../../../Toaster";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { allSettled, isRejectedResult } from "../../../Utility/promise";
import { history } from "../../../../history";
import "./QuizAccountSettings.scss";


const QuizFrequencyNames = [Frequency.Daily, Frequency.Weekly, Frequency.Monthly].map((frequency) =>
	ucwords(frequency)
) as Frequency[];

interface IState {
	loading: boolean;
	processing: boolean;
	failures: ValidationFailures | null;
	pointSources: PointSourceItem[];
	frequency: Frequency | null;
	questionCount: number | null;
	completedRewardSource: PointSourceItem | null;
}

export class QuizAccountSettings extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public readonly state: IState = {
		loading: false,
		processing: false,
		failures: null,
		pointSources: [],
		frequency: null,
		questionCount: null,
		completedRewardSource: null,
	};

	public async componentDidMount() {
		this.setState({
			loading: true,
		});

		let data: [
			PointSourceItem[],
			Account
		];

		try {
			data = await allSettled([
				PointSourceModel.list(this.context!.account.id),
				AccountModel.read(this.context!.account.id),
			]).then((allSettledResult) => {
				const result = allSettledResult.map((result) => {
					if (isRejectedResult(result)) {
						throw new Error(result.reason);
					} else {
						return result.value.data;
					}
				});

				return [result[0] as PointSourceItem[], result[1] as Account];
			});
		} catch (e) {
			toaster.error("Failed to load account settings.");

			history.push("/");

			return;
		}

		const [pointSources, account] = data;

		const frequency = account.quizFrequency;
		const sourceId = account.completedRewardPointSourceId;
		const completedRewardSource = pointSources.find((source) => source.id.$oid === sourceId?.toString()) ?? null;
		const questionCount = account.questionCount;

		this.setState({
			loading: false,
			pointSources,
			frequency,
			questionCount,
			completedRewardSource,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<section className="gm-page-wrapper">
				<PageHeader title="Quiz - Account Settings" />

				<form className="account-settings-wrapper" onSubmit={this.onSaveButtonClick}>
					<ValidationAwareFormGroup labelFor="quizFrequency" failures={this.state.failures}>
						<label htmlFor="quizFrequency">
							Quiz Frequency
						</label>

						<Select<Frequency>
							inputProps={{
								id: "quizFrequency",
								name: "quizFrequency"
							}}
							items={QuizFrequencyNames}
							onItemSelect={this.onFrequencyChange}
							filterable={false}
							itemRenderer={renderFrequencyOption}
							noResults={
								<MenuItem
									disabled={true} text="No results."
									roleStructure="listoption"
								/>
							}
						>
							<Button
								fill={true}
								text={this.state.frequency ? ucwords(this.state.frequency) : "Select quiz frequency"}
								rightIcon="double-caret-vertical"
								placeholder="Select quiz frequency"
							/>
						</Select>
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup labelFor="questionCount" failures={this.state.failures}>
						<label htmlFor="questionCount">
							Question Count
						</label>

						<InputGroup
							fill={true}
							id="questionCount"
							name="questionCount"
							type="number"
							value={this.state.questionCount?.toString()}
							placeholder="0"
							onChange={this.onQuestionCountChange}
						/>
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup labelFor="quizRewardSource" failures={this.state.failures}>
						<label htmlFor="quizRewardSource">
							Quiz Reward Source
						</label>

						<Select<PointSourceItem>
							inputProps={{
								id: "quizRewardSource",
								name: "quizRewardSource"
							}}
							items={this.state.pointSources}
							onItemSelect={this.onRewardSourceChange}
							filterable={false}
							itemRenderer={renderPointSourceOption}
							noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
						>
							<Button
								fill={true}
								text={
									this.state.completedRewardSource ? this.state.completedRewardSource.name : "Select Quiz reward source"
								}
								rightIcon="double-caret-vertical"
							/>
						</Select>
					</ValidationAwareFormGroup>

					<Button loading={this.state.processing} type="submit" intent={Intent.PRIMARY} text="Save" />
				</form>
			</section>
		);
	}

	private onSaveButtonClick = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		this.setState({
			processing: true,
			failures: null,
		});

		try {
			await AccountModel.update(this.context!.account.id, {
				quizFrequency: this.state.frequency!,
				completedRewardPointSourceId: this.state.completedRewardSource?.id.$oid,
				questionCount: this.state.questionCount!,
			}).then(() => {
				toaster.success("Account settings updated.");
			});
		} catch (e) {
			if (isValidationFailureError(e)) {
				toaster.error("Failed to update account settings.");
				this.setState({
					failures: e.context.failures,
				});
			} else {
				toaster.showUnhandledErrorMessage();
			}
		}

		this.setState({
			processing: false,
		});
	};

	private onQuestionCountChange = (event: React.FormEvent<HTMLInputElement>) => {
		this.setState({
			questionCount: parseInt(event.currentTarget.value),
		});
	};

	private onRewardSourceChange = (source: PointSourceItem) => {
		this.setState({
			completedRewardSource: source,
		});
	};

	private onFrequencyChange = (frequency: Frequency) => {
		this.setState({
			frequency,
		});
	};
}

const renderFrequencyOption: ItemRenderer<Frequency> = (frequency, { handleClick, handleFocus, modifiers }) => {
	if (!modifiers.matchesPredicate) return null;

	return (
		<MenuItem
			active={modifiers.active}
			disabled={modifiers.disabled}
			key={frequency}
			onClick={handleClick}
			onFocus={handleFocus}
			roleStructure="listoption"
			text={frequency}
		/>
	);
};

const renderPointSourceOption: ItemRenderer<PointSourceItem> = (item, { handleClick, modifiers }) => {
	if (!modifiers.matchesPredicate) {
		return null;
	}

	return <MenuItem active={modifiers.active} key={item.id.$oid} text={ucwords(item.name)} onClick={handleClick} />;
};
