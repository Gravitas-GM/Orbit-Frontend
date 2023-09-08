import React from "react";
import { Button, H3, InputGroup, Intent } from "@blueprintjs/core";
import { ValidationAwareFormGroup } from "../../../../ValidationAwareFormGroup";
import { ValidationFailures } from "../../../../../Api/errors/symfony";
import {QuestionKind, Question, QuestionUpdate} from '../../../../../Api/Quiz/Models/Questions';
import { Spacing } from "../../../../../Styles/variables";
import * as toaster from "../../../../../Toaster";
import "../AnswerForm.scss";

interface IProps {
	question: Question | null;
	prompt?: string;
	tagId: number;
	validationFailures: ValidationFailures | null;
	onQuestionSave: (question: QuestionUpdate) => Promise<void>;
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

	const onSaveClick = React.useCallback(() => {
		const questionData: QuestionUpdate = {
			tag: props.tagId,
			prompt: props.prompt!,
			kind: QuestionKind.FreeText,
			answers: answers,
		};

		return props.onQuestionSave(questionData);
	}, [props, answers]);

	const onAnswerTextChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>, index: number) => {
		setAnswers((currentOptions) => {
			const answers = [...currentOptions];

			answers[index] = event.target.value;

			return answers;
		});
	}, []);

	return (
		<div>
			<H3>Free Text</H3>

			{answers.map((option, index) => {
				return (
					<ValidationAwareFormGroup
						labelFor={`answer-${index}`}
						failures={props.validationFailures}
						key={option}
						className="answer-form-container"
					>
						<div className="free-text-container">
							<InputGroup
								id={`answer-${index}`}
								name={`answer-${index}`}
								type="text"
								defaultValue={option}
								large={true}
								style={{ width: "100%" }}
								onChange={(event) => onAnswerTextChange(event, index)}
							/>

							<Button icon="remove" minimal onClick={() => onAnswerRemove(index)} />
						</div>
					</ValidationAwareFormGroup>
				);
			})}

			<Button style={{ marginTop: Spacing.Medium }} text="Add Answer" icon="plus" onClick={onAnswerAdd} />

			<hr className="answer-form-separator" />

			<Button
				loading={props.processing}
				large={true}
				intent={Intent.PRIMARY}
				text="Save Question"
				icon="floppy-disk"
				onClick={onSaveClick}
			/>
		</div>
	);
};
