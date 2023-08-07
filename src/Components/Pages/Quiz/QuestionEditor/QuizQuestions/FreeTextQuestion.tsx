import React from "react";
import { Button, H3, InputGroup, Intent } from "@blueprintjs/core";
import { ValidationAwareFormGroup } from "../../../../ValidationAwareFormGroup";
import { ValidationFailures } from "../../../../../Api/errors/symfony";
import { QuestionKind, QuestionCreatePayload, Question } from "../../../../../Api/Quiz/Models/Questions";
import { Spacing } from "../../../../../Styles/variables";
import * as toaster from "../../../../../Toaster";

interface IProps {
	question?: Question;
	prompt?: string;
	tagId: number;
	accountId: number;
	validationFailures: ValidationFailures | null;
	saveQuestion: (question: QuestionCreatePayload) => Promise<void>;
	processing: boolean;
}

export const FreeTextQuestion: React.FC<IProps> = (props) => {
	const [answers, setAnswers] = React.useState<string[]>(["Correct Answer"]);

	React.useEffect(() => {
		if (props.question && props.question.kind === QuestionKind.FreeText) {
			setAnswers(props.question.answers);
		}
	}, [props.question]);

	const onAnswerRemove = React.useCallback(
		(index: number) => {
			if (answers.length <= 1) {
				toaster.info("You must have at least one answer");

				return;
			}

			setAnswers((answers) => {
				return answers.filter((_, i) => i !== index);
			});
		},
		[answers]
	);

	const onAnswerAdd = React.useCallback(() => {
		setAnswers((answers) => {
			return [...answers, `Alternative Answer ${answers.length + 1}`];
		});
	}, [answers]);

	const onClickSave = React.useCallback(() => {
		const questionData = {
			accountId: props.accountId,
			tagId: props.tagId,
			prompt: props.prompt!,
			kind: QuestionKind.Boolean,
			answers: answers,
		};

		return props.saveQuestion(questionData);
	}, [props, answers]);

	const onChangeAnswerText = React.useCallback((event: React.ChangeEvent<HTMLInputElement>, index: number) => {
		setAnswers((currentOptions) => {
			const answers = [...currentOptions];

			answers[index] = event.target.value;

			return answers;
		});
	}, []);

	return (
		<div>
			<H3>Free Text Alternatives</H3>

			{answers.map((option, index) => {
				return (
					<ValidationAwareFormGroup
						labelFor={`option-${index}`}
						failures={props.validationFailures}
						key={option}
						className="answer-form-container"
					>
						<div className="free-text-container">
							<InputGroup
								id={`option-${index}`}
								name={`option-${index}`}
								type="text"
								defaultValue={option}
								large={true}
								style={{ width: "100%" }}
								onChange={(event) => onChangeAnswerText(event, index)}
							/>

							<Button icon="remove" minimal onClick={() => onAnswerRemove(index)} />
						</div>
					</ValidationAwareFormGroup>
				);
			})}

			<Button style={{ marginTop: Spacing.Medium }} text="Add Answer" icon="plus" onClick={onAnswerAdd} />

			<hr className="option-form-separator" />

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
