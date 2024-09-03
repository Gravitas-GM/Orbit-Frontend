import * as React from 'react';
import './index.scss';
import {ValidationFailures} from '../../../../api/errors/symfony';
import {
	BooleanQuestion,
	FreeTextQuestion,
	MultipleChoiceQuestion,
	Question,
	QuestionKind,
} from '../../../../api/Quiz/Models/Questions';
import {BooleanForm} from './BooleanForm';
import {FreeTextForm} from './FreeTextForm';
import {MultipleChoiceForm} from './MultipleChoiceForm';

export interface FormProps<TQuestion extends Question, THandler> {
	onSave: THandler;
	validationFailures: ValidationFailures | null;
	question: TQuestion | null;
	processing: boolean;
	dirty: boolean;
}

interface BaseProps {
	kind: QuestionKind;
	validationFailures: ValidationFailures | null;
	question: Question | null;
	processing: boolean;
	dirty: boolean;
}

type SaveHandler<T, K extends keyof T> = (data: Pick<T, K>) => Promise<void>;

export type BooleanSaveHandler = SaveHandler<BooleanQuestion, 'answer' | 'trueLabel' | 'falseLabel'>;

interface BooleanProps extends BaseProps {
	kind: QuestionKind.Boolean;
	onSave: BooleanSaveHandler;
}

export type FreeTextSaveHandler = SaveHandler<FreeTextQuestion, 'answers'>;

interface FreeTextProps extends BaseProps {
	kind: QuestionKind.FreeText;
	onSave: FreeTextSaveHandler;
}

export type MultipleChoiceSaveHandler = SaveHandler<MultipleChoiceQuestion, 'choices' | 'answerIndex'>;

interface MultipleChoiceProps extends BaseProps {
	kind: QuestionKind.MultipleChoice;
	onSave: MultipleChoiceSaveHandler;
}

type Props = BooleanProps | FreeTextProps | MultipleChoiceProps;

export const QuestionForm: React.FC<Props> = ({kind, onSave, question, ...formProps}) => {
	switch (kind) {
		case QuestionKind.Boolean:
			return <BooleanForm onSave={onSave} question={question as BooleanQuestion | null} {...formProps} />;

		case QuestionKind.MultipleChoice:
			return <MultipleChoiceForm onSave={onSave} question={question as MultipleChoiceQuestion} {...formProps} />;

		case QuestionKind.FreeText:
			return <FreeTextForm onSave={onSave} question={question as FreeTextQuestion} {...formProps} />;

		default:
			throw new Error(`Unsupported question kind "${kind}"`);
	}
};
