import { useCallback, useContext, useEffect, useState } from "react";
import { Button, InputGroup, MenuItem } from "@blueprintjs/core";
import { ValidationAwareFormGroup } from "../../../ValidationAwareFormGroup";
import { PageHeader } from "../../../PageHeader";
import { ValidationFailures, isValidationFailureError } from "../../../../Api/errors/symfony";
import { Select2 as Select, ItemRenderer } from '@blueprintjs/select';
import { ucwords } from "../../../Utility/string";
import { Account, AccountModel, Frequency } from "../../../../Api/Quiz/Models/Accounts";
import { UserContext } from "../../../../Session";
import {PointSourceItem, PointSourceModel} from '../../../../Api/Point-Tracking/Models/Sources';
import * as toaster from "../../../../Toaster"
import { history } from "../../../../history";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { allSettled, isRejectedResult } from "../../../Utility/promise";
import { Spacing } from "../../../../Styles/variables";

const QuizFrequencyNames = [Frequency.Daily, Frequency.Weekly, Frequency.Monthly].map((frequency) =>
	ucwords(frequency)
) as Frequency[];

const isPointSourceArray = (data: any): data is PointSourceItem[] => {
	return Array.isArray(data) && data.every(isPointSourceItem);
};
const isPointSourceItem = (data: any): data is PointSourceItem => {
	return typeof data === 'object' && data.point_value !== null;
};
const isAccountModel = (data: any): data is Account => {
	return typeof data === 'object' && data.accountId !== null;
};

export const AccountSettings: React.FC = () => {
	const User = useContext(UserContext);

	const [loading, setLoading] = useState(false);
	const [processing, setIsProcessing] = useState(false);
	const [failures, setFailures] = useState<ValidationFailures | null>(null);
	const [pointSources, setPointSources] = useState<PointSourceItem[]>([]);
	const [frequency, setFrequency] = useState<Frequency | null>(null);
	const [questionCount, setQuestionCount] = useState<number | null>(null);
	const [completedRewardSource, setCompletedRewardSource] = useState<PointSourceItem | null>(null);

	useEffect(() => {
		setLoading(true);

		allSettled([PointSourceModel.list(User!.account.id), AccountModel.read(User!.account.id)])
			.then((results) => {
				let failureCount = 0;
				let pointSourceItems: PointSourceItem[] = [];

				for (const result of results) {
					if (isRejectedResult(result)) {
						failureCount++;

						continue;
					}

					if (isPointSourceArray(result.value.data)) {
						pointSourceItems = result.value.data;

						setPointSources(result.value.data);
					}

					if (isAccountModel(result.value.data)) {
						setFrequency(result.value.data.quizFrequency);

						setQuestionCount(result.value.data.questionCount);

						const sourceId = result.value.data.completedRewardPointSourceId;
						const source = pointSourceItems.find((source) => source.id.$oid === sourceId);

						if (source) {
							setCompletedRewardSource(source);
						}
					}
				}
				if (failureCount > 0) {
					toaster.error('Failed to load account settings data.');
				}
			}).catch(() => {
				toaster.showUnhandledErrorMessage();

				history.push('/');
			}).finally(() => {
				setLoading(false);
			});
	}, []);

	const onSaveButtonClick = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setIsProcessing(true);
		setFailures(null);

		try {
			await AccountModel.update(User!.account.id, {
				quizFrequency: frequency!,
				completedRewardPointSourceId: completedRewardSource?.id.$oid,
				questionCount: questionCount!,
			}).then(() => {
				toaster.success('Account settings updated.');
			});
		} catch (e) {
			if (isValidationFailureError(e)) {
				setFailures(e.context.failures);
			} else {
				toaster.error('Failed to update account settings.');
			}
		}

		setIsProcessing(false);
	}, []);

	if (loading)
		return <FrameLoadingSpinner />;


	return(
		<section className="gm-page-wrapper">
		<PageHeader title="Quiz - Account Settings" />
			<form onSubmit={onSaveButtonClick}>
				<ValidationAwareFormGroup labelFor="quiz-frequency" failures={failures}>
					<label style={{ marginBottom: Spacing.Medium, display: 'block' }} htmlFor="quiz-frequency">Quiz Frequency</label>

					<Select<Frequency>
						inputProps={{ id: 'quiz-frequency' }}
							items={QuizFrequencyNames}
							onItemSelect={setFrequency}
							filterable={false}
							itemRenderer={renderFrequencyOption}
							noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
						>

							<Button
								style={{ width: '250px' }}
								text={frequency ? frequency : 'Select quiz frequency'}
								rightIcon="double-caret-vertical"
								placeholder="Select quiz frequency"
							/>
					</Select>
				</ValidationAwareFormGroup>

				<ValidationAwareFormGroup labelFor="question-count" failures={failures}>
					<label style={{ marginBottom: Spacing.Medium, display: 'block' }} htmlFor="question-count">Question Count</label>

					<InputGroup
						style={{ maxWidth: '250px' }}
						id="question-count"
						type="number"
						placeholder="0"
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							setQuestionCount(parseInt(event.currentTarget.value));
						}}
					/>
				</ValidationAwareFormGroup>

				<ValidationAwareFormGroup labelFor="quiz-reward-source" failures={failures}>
					<label style={{ marginBottom: Spacing.Medium, display: 'block' }} htmlFor="quiz-reward-source">Quiz Reward Source</label>

					<Select<PointSourceItem>
							inputProps={{ id: 'quiz-reward-source' }}
							items={pointSources}
							onItemSelect={setCompletedRewardSource}
							filterable={false}
							itemRenderer={renderPointSourceOption}
							noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
						>

							<Button
								style={{ width: '250px' }}
								text={completedRewardSource ? completedRewardSource.name : 'Select Quiz reward source'}
								rightIcon="double-caret-vertical"
							/>
					</Select>
				</ValidationAwareFormGroup>


				<Button	loading={processing} type="submit" intent="primary" text="Save" />
			</form>
		</section>
	)
}



const renderFrequencyOption: ItemRenderer<Frequency> = (frequency, {handleClick, handleFocus, modifiers}) => {
	if (!modifiers.matchesPredicate)
		return null;

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


const renderPointSourceOption: ItemRenderer<PointSourceItem> = (item, {handleClick, modifiers}) => {
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
