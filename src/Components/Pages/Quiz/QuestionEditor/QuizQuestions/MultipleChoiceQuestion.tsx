import React from "react";
import { Button, H3, InputGroup, Radio, Intent } from "@blueprintjs/core";
import { ValidationAwareFormGroup } from "../../../../ValidationAwareFormGroup";
import { ValidationFailures } from "../../../../../Api/errors/symfony";
import { QuestionKind, QuestionCreatePayload, Question } from "../../../../../Api/Quiz/Models/Questions";
import { Spacing } from "../../../../../Styles/variables";
import * as toaster from "../../../../../Toaster";
import "../AnswerForm.scss";

interface IProps {
	question: Question | null;
	prompt?: string;
	tagId: number;
	accountId: number;
	validationFailures: ValidationFailures | null;
	saveQuestion: (question: QuestionCreatePayload) => Promise<void>;
	processing: boolean;
}

export const MultipleChoiceQuestion: React.FC<IProps> = (props) => {
	const [choices, setChoices] = React.useState<string[]>(["Correct Choice"]);
	const [answerIndex, setAnswerIndex] = React.useState<number>(0);

	React.useEffect(() => {
		if (props.question && props.question.kind === QuestionKind.MultipleChoice) {
			setChoices(props.question.choices);
			setAnswerIndex(props.question.answerIndex);
		}
	}, [props.question]);

	const onChoiceRemove = React.useCallback(
		(index: number) => {
			if (choices.length <= 1) {
				toaster.info("You must have at least one choice");

				return;
			}

			setChoices((choices) => {
				return choices.filter((_, i) => i !== index);
			});
		},
		[choices]
	);

	const onChoiceAdd = React.useCallback(() => {
		setChoices((choices) => {
			return [...choices, `Alternative Choice ${choices.length + 1}`];
		});
	}, [choices]);

	const onClickSave = React.useCallback(() => {
		const questionData = {
			accountId: props.accountId,
			tagId: props.tagId,
			prompt: props.prompt!,
			kind: QuestionKind.MultipleChoice,
			choices: choices,
		};

		return props.saveQuestion(questionData);
	}, [props, choices]);

	const onChangeAnswerText = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>, index: number) => {
			setChoices((currentOptions) => {
				const choices = [...currentOptions];

				choices[index] = event.target.value;

				return choices;
			});
		},
		[choices]
	);

	const onChangeAnswerIndex = React.useCallback(
		(event: React.FormEvent<HTMLInputElement>) => {
			setAnswerIndex(parseInt(event.currentTarget.value));
		},
		[answerIndex]
	);

	return (
		<div>
			<H3>Multiple Choice</H3>

			{choices.map((option, index) => {
				return (
					<div key={option} className="multiple-choice-container">
						<div className="multiple-choice">
							<ValidationAwareFormGroup
								labelFor={`option-${index}`}
								failures={props.validationFailures}
								className="answer-form-container"
							>
								<InputGroup
									id={`option-${index}`}
									name={`option-${index}`}
									type="text"
									defaultValue={option}
									large={true}
									style={{ width: "100%" }}
									onChange={(event) => onChangeAnswerText(event, index)}
								/>

								<Button icon="remove" minimal onClick={() => onChoiceRemove(index)} />
							</ValidationAwareFormGroup>
						</div>

						<ValidationAwareFormGroup labelFor="correct_answer" failures={props.validationFailures}>
							<Radio
								id="correct_answer"
								label="Correct Answer"
								checked={index === answerIndex}
								onChange={onChangeAnswerIndex}
								value={index}
							/>
						</ValidationAwareFormGroup>
					</div>
				);
			})}

			<Button style={{ marginTop: Spacing.Medium }} text="Add Answer" icon="plus" onClick={onChoiceAdd} />

			<hr className="answer-form-separator" />

			<Button
				loading={props.processing}
				large={true}
				intent={Intent.PRIMARY}
				text="Save Question"
				icon="floppy-disk"
				onClick={onClickSave}
			/>
		</div>
	);
};
