import * as React from 'react';
import {ValidationFailures} from '../../../../../Api/errors/symfony';
import './index.scss';
import {
	Question,
	FreeTextQuestion,
	ChoiceQuestion,
	ScaleQuestion,
	SurveyQuestionKind,
} from '../../../../../Api/Survey/Models/BankQuestions';
import {SurveyEditorType} from '../index';
import {ChoiceForm} from './ChoiceForm';
import {FreeTextForm} from './FreeTextForm';
import {ScaleForm} from './ScaleForm';

export interface FormProps<TQuestion extends Question, THandler> {
	survey: string;
	surveyEditorType: SurveyEditorType;
	onSave: THandler;
	validationFailures: ValidationFailures | null;
	question: TQuestion | null;
	processing: boolean;
	dirty: boolean;
}

interface BaseProps {
	survey: string;
	surveyEditorType: SurveyEditorType;
	kind: SurveyQuestionKind;
	validationFailures: ValidationFailures | null;
	question: Question | null;
	processing: boolean;
	dirty: boolean;
}

type SaveHandler<T, K extends keyof T> = (data: Pick<T, K>) => Promise<void>;

export type ScaleSaveHandler = SaveHandler<ScaleQuestion, 'startValue' | 'endValue' | 'stepAmount'>;

interface ScaleProps extends BaseProps {
	kind: SurveyQuestionKind.Scale;
	onSave: ScaleSaveHandler;
}

export type FreeTextSaveHandler = SaveHandler<FreeTextQuestion, 'prompt'>;

interface FreeTextProps extends BaseProps {
	kind: SurveyQuestionKind.FreeText;
	onSave: FreeTextSaveHandler;
}

export type ChoiceSaveHandler = SaveHandler<ChoiceQuestion, 'choices'>;

interface ChoiceProps extends BaseProps {
	kind: SurveyQuestionKind.Choice;
	onSave: ChoiceSaveHandler;
}

type Props = ScaleProps | FreeTextProps | ChoiceProps;

export const QuestionTypeForm: React.FC<Props> = ({kind, onSave, question, ...formProps}) => {
	switch (kind) {
		case SurveyQuestionKind.Scale:
			return <ScaleForm onSave={onSave} question={question as ScaleQuestion | null} {...formProps} />;

		case SurveyQuestionKind.Choice:
			return <ChoiceForm onSave={onSave} question={question as ChoiceQuestion} {...formProps} />;

		case SurveyQuestionKind.FreeText:
			return <FreeTextForm onSave={onSave} question={question as FreeTextQuestion} {...formProps} />;

		default:
			throw new Error(`Unsupported question kind "${kind}"`);
	}
};
