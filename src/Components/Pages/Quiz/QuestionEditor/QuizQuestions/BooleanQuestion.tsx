import React from "react";
import { Button, H3, InputGroup, Intent, Radio } from "@blueprintjs/core";
import { ValidationAwareFormGroup } from "../../../../ValidationAwareFormGroup";
import { ValidationFailures } from "../../../../../Api/errors/symfony";
import { QuestionKind, QuestionCreatePayload, Question } from "../../../../../Api/Quiz/Models/Questions";

interface IProps {
	question?: Question;
	prompt?: string;
	tagId: number;
	accountId: number;
	validationFailures: ValidationFailures | null;
	saveQuestion: (question: QuestionCreatePayload) => Promise<void>;
	loading: boolean;
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

	const onClickSave = React.useCallback(() => {
		const questionData = {
			accountId: props.accountId,
			tagId: props.tagId,
			prompt: props.prompt!,
			kind: QuestionKind.Boolean,
			answer,
			trueLabel,
			falseLabel,
		};

		return props.saveQuestion(questionData);
	}, [props, answer, trueLabel, falseLabel]);

	return (
		<div>
			<H3>Boolean Labels</H3>

			{options.map((option, index) => (
				<div key={option} className="boolean-container">
					<div className="boolean-answer">
						<ValidationAwareFormGroup labelFor={`boolean-label-${index}`} failures={props.validationFailures}>
							<InputGroup
								leftIcon={index === 0 ? "confirm" : "cross"}
								id={`boolean-label-${index}`}
								type="text"
								placeholder={option}
								large={true}
								style={{ width: "100%" }}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									setBooleanLabel(index, e.target.value);
								}}
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
				loading={props.loading}
				large={true}
				intent={Intent.PRIMARY}
				text="Save Question"
				icon="floppy-disk"
				onClick={onClickSave}
			/>
		</div>
	);
};
