import * as React from 'react';
import { Button, H3, InputGroup, Intent, Radio } from "@blueprintjs/core";
import { ValidationAwareFormGroup } from "../../../../ValidationAwareFormGroup";
import { ValidationFailures } from "../../../../../Api/errors/symfony";
import {QuestionKind, Question, QuestionUpdate} from '../../../../../Api/Quiz/Models/Questions';
import "../AnswerForm.scss";

interface IProps {
	question: Question | null;
	prompt?: string;
	tagId: number;
	validationFailures: ValidationFailures | null;
	onQuestionSave: (question: QuestionUpdate) => Promise<void>;
	processing: boolean;
}

export const BooleanQuestion: React.FC<IProps> = (props) => {
	const [answer, setAnswer] = React.useState(true);
	const [options] = React.useState<string[]>(["True", "False"]);
	const [trueLabel, setTrueLabel] = React.useState<string | null>(null);
	const [falseLabel, setFalseLabel] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (props.question && props.question.kind === QuestionKind.Boolean) {
			setAnswer(props.question.answer);
			setTrueLabel(props.question.trueLabel);
			setFalseLabel(props.question.falseLabel);
		}
	}, [props.question]);

	const setBooleanLabel = React.useCallback((index: number, label: string) => {
		if (index === 0) {
			setTrueLabel(label);
		} else {
			setFalseLabel(label);
		}
	}, []);

	const setBooleanAnswer = React.useCallback((index: number) => {
		if (index === 0) {
			setAnswer(true);
		} else {
			setAnswer(false);
		}
	}, []);

	const onBooleanToggle = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;

		const index = target.id === "boolean-label-0" ? 0 : 1;

		setBooleanLabel(index, event.currentTarget.value);
	}, [trueLabel, falseLabel]);

	const onSaveClick = React.useCallback(() => {
		const questionData: QuestionUpdate = {
			tag: props.tagId,
			prompt: props.prompt!,
			kind: QuestionKind.Boolean,
			answer,
			trueLabel,
			falseLabel,
		};

		return props.onQuestionSave(questionData);
	}, [props, answer, trueLabel, falseLabel]);

	return (
		<div>
			<H3>Boolean</H3>

			{options.map((option, index) => (
				<div key={option} className="boolean-container">
					<div className="boolean-answer">
						<ValidationAwareFormGroup labelFor={`boolean-label-${index}`} failures={props.validationFailures}>
							<InputGroup
								leftIcon={index === 0 ? "confirm" : "cross"}
								id={`boolean-label-${index}`}
								type="text"
								placeholder={option}
								value={(index === 0 ? trueLabel : falseLabel) ?? ""}
								large={true}
								style={{ width: "100%" }}
								onChange={onBooleanToggle}
							/>
						</ValidationAwareFormGroup>

						<ValidationAwareFormGroup labelFor="correct-answer" failures={props.validationFailures}>
							<Radio
								id="correct-answer"
								label="Correct Answer"
								checked={index === 0 ? answer === true : answer === false}
								onChange={() => setBooleanAnswer(index)}
							/>
						</ValidationAwareFormGroup>
					</div>
				</div>
			))}

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
