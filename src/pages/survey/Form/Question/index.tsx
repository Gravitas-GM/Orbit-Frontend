import {ReactElement, ReactNode} from 'react';
import {ValidationFailures} from '../../../../api/errors/symfony';
import {QuestionKind} from '../../../../api/Survey';
import {
	SurveyChoiceQuestion,
	SurveyFreeTextQuestion,
	SurveyQuestion,
	SurveyScaleQuestion,
} from '../../../../api/Survey/Models/SurveyQuestion';
import {ValidationAwareFormGroup} from '../../../../components/ValidationAwareFormGroup';
import {ChoiceQuestion} from './ChoiceQuestion';
import {FreeTextQuestion} from './FreeTextQuestion';
import {ScaleQuestion} from './ScaleQuestion';

export type ChangeArgs<T extends SurveyQuestion> = T extends SurveyFreeTextQuestion ? { response: string } :
	T extends SurveyScaleQuestion ? { response: number } :
		T extends SurveyChoiceQuestion ? { response: number } : never;

export type ChangeFn<T extends SurveyQuestion = SurveyQuestion> = (index: number, args: ChangeArgs<T>) => void;

export interface QuestionProps<T extends SurveyQuestion> {
	index: number,
	question: T,
	onChange: ChangeFn<T>,
}

interface Props {
	index: number,
	question: SurveyQuestion,
	onChange: ChangeFn,
	validation: ValidationFailures | null,
}

export function Question({index, question, onChange, validation}: Props): ReactElement {
	let content: ReactNode;

	if (question.kind === QuestionKind.FreeText)
		content = <FreeTextQuestion index={index} question={question} onChange={onChange} />;
	else if (question.kind === QuestionKind.Scale)
		content = <ScaleQuestion index={index} question={question} onChange={onChange} />;
	else if (question.kind === QuestionKind.Choice)
		content = <ChoiceQuestion index={index} question={question} onChange={onChange} />;
	else
		throw new Error(`Unrecognized question kind`);

	return (
		<ValidationAwareFormGroup label={question.prompt} labelFor={`response[${index}]`} failures={validation}>
			{content}
		</ValidationAwareFormGroup>
	);
}
