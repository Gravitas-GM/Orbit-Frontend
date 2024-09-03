import {ReactElement, ReactNode} from 'react';
import {ValidationFailures} from '../../../../api/errors/symfony';
import {QuestionKind} from '../../../../api/Survey';
import {AsResponse, SurveyQuestion} from '../../../../api/Survey/Models/SurveyQuestion';
import {ValidationAwareFormGroup} from '../../../../components/ValidationAwareFormGroup';
import {ResponseChangeFn} from '../index';
import {ChoiceQuestion} from './ChoiceQuestion';
import {FreeTextQuestion} from './FreeTextQuestion';
import {ScaleQuestion} from './ScaleQuestion';

export interface QuestionProps<T extends SurveyQuestion> {
	index: number,
	onChange: ResponseChangeFn<AsResponse<T>>,
}

interface Props<T extends SurveyQuestion> {
	index: number,
	question: T,
	validation: ValidationFailures | null,
	onChange: ResponseChangeFn,
}

export function Question<T extends SurveyQuestion>({index, question, validation, onChange}: Props<T>): ReactElement {
	let content: ReactNode;

	if (question.kind === QuestionKind.FreeText)
		content = <FreeTextQuestion index={index} onChange={onChange} />;
	else if (question.kind === QuestionKind.Choice)
		content = <ChoiceQuestion index={index} choices={question.choices} onChange={onChange} />;
	else if (question.kind === QuestionKind.Scale) {
		content = (
			<ScaleQuestion
				index={index}
				min={question.startValue}
				max={question.endValue}
				stepSize={question.stepAmount}
				onChange={onChange}
			/>
		);
	} else
		throw new Error(`Unrecognized question kind`);

	return (
		<ValidationAwareFormGroup label={question.prompt} labelFor={`response[${index}]`} failures={validation}>
			{content}
		</ValidationAwareFormGroup>
	);
}
