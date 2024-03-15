import * as React from 'react';
import {ValidationFailures} from '../../../../../Api/errors/symfony';
import './index.scss';
import {
	BankQuestion,
	FreeTextQuestion, MultipleChoiceQuestion,
	ScaleQuestion,
	SurveyQuestionKind,
} from '../../../../../Api/Survey/Models/BankQuestions';
import {MultipleChoiceForm} from './MultipleChoiceForm';
import {FreeTextForm} from './FreeTextForm';
import {ScaleForm} from './ScaleForm';

export interface FormProps<TQuestion extends BankQuestion, THandler> {
	onSave: THandler;
	validationFailures: ValidationFailures | null;
	question: TQuestion | null;
	processing: boolean;
	dirty: boolean;
}

interface BaseProps {
	kind: SurveyQuestionKind;
	validationFailures: ValidationFailures | null;
	question: BankQuestion | null;
	processing: boolean;
	dirty: boolean;
}

type SaveHandler<T, K extends keyof T> = (data: Pick<T, K>) => Promise<void>;

export type ScaleSaveHandler = SaveHandler<ScaleQuestion, 'minValue' | 'maxValue'>;

interface ScaleProps extends BaseProps {
	kind: SurveyQuestionKind.Scale;
	onSave: ScaleSaveHandler;
}

export type FreeTextSaveHandler = SaveHandler<FreeTextQuestion, 'prompt'>;

interface FreeTextProps extends BaseProps {
	kind: SurveyQuestionKind.FreeText;
	onSave: FreeTextSaveHandler;
}

export type MultipleChoiceSaveHandler = SaveHandler<MultipleChoiceQuestion, 'choices'>;

interface MultipleChoiceProps extends BaseProps {
	kind: SurveyQuestionKind.MultipleChoice;
	onSave: MultipleChoiceSaveHandler;
}

type Props = ScaleProps | FreeTextProps | MultipleChoiceProps;

export const QuestionForm: React.FC<Props> = ({kind, onSave, question, ...formProps}) => {
	// TODO: update redirect path to redirect to the survey's editor
	switch (kind) {
		case SurveyQuestionKind.Scale:
			return <ScaleForm onSave={onSave} question={question as ScaleQuestion | null} {...formProps} />;

		case SurveyQuestionKind.MultipleChoice:
			return <MultipleChoiceForm onSave={onSave} question={question as MultipleChoiceQuestion} {...formProps} />;

		case SurveyQuestionKind.FreeText:
			return <FreeTextForm onSave={onSave} question={question as FreeTextQuestion} {...formProps} />;

		default:
			throw new Error(`Unsupported question kind "${kind}"`);
	}
};
