import * as React from 'react';
import {
	BooleanQuestion,
	FreeTextQuestion,
	MultipleChoiceQuestion,
	Question,
	QuestionKind,
} from '../../../../../Api/Quiz/Models/Questions';
import {BooleanForm} from './BooleanForm';
import {ValidationFailures} from '../../../../../Api/errors/symfony';
import './index.scss';
import {MultipleChoiceForm} from './MultipleChoiceForm';
import {FreeTextForm} from './FreeTextForm';

export interface FormProps<TQuestion extends Question, THandler> {
	onSave: THandler;
	onCancel: () => void;
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
	onCancel: () => void;
}

export type FreeTextSaveHandler = SaveHandler<FreeTextQuestion, 'answers'>;

interface FreeTextProps extends BaseProps {
	kind: QuestionKind.FreeText;
	onSave: FreeTextSaveHandler;
	onCancel: () => void;
}

export type MultipleChoiceSaveHandler = SaveHandler<MultipleChoiceQuestion, 'choices' | 'answerIndex'>;

interface MultipleChoiceProps extends BaseProps {
	kind: QuestionKind.MultipleChoice;
	onSave: MultipleChoiceSaveHandler;
	onCancel: () => void;
}

type Props = BooleanProps | FreeTextProps | MultipleChoiceProps;

export const QuestionForm: React.FC<Props> = ({kind, onSave, onCancel, question, ...formProps}) => {
	switch (kind) {
		case QuestionKind.Boolean:
			return <BooleanForm onCancel={onCancel} onSave={onSave} question={question as BooleanQuestion | null} {...formProps} />;

		case QuestionKind.MultipleChoice:
			return <MultipleChoiceForm onCancel={onCancel} onSave={onSave} question={question as MultipleChoiceQuestion} {...formProps} />;

		case QuestionKind.FreeText:
			return <FreeTextForm onCancel={onCancel} onSave={onSave} question={question as FreeTextQuestion} {...formProps} />;

		default:
			throw new Error(`Unsupported question kind "${kind}"`);
	}
};
