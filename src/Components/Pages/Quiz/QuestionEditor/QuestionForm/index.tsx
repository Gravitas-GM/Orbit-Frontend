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

export interface FormProps<TQuestion extends Question, THandler> {
	onSave: THandler;
	validationFailures: ValidationFailures | null;
	question: TQuestion | null;
	processing: boolean;
}

interface BaseProps {
	kind: QuestionKind;
	validationFailures: ValidationFailures | null;
	question: Question | null;
	processing: boolean;
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

function isBooleanQuestion(question: Question | null, kind: QuestionKind): question is BooleanQuestion | null {
	return question?.kind === QuestionKind.Boolean || kind === QuestionKind.Boolean;
}

export const QuestionForm: React.FC<Props> = ({kind, onSave, question, ...formProps}) => {
	switch (kind) {
		case QuestionKind.Boolean:
			return <BooleanForm onSave={onSave} question={question as BooleanQuestion | null} {...formProps} />;

		case QuestionKind.MultipleChoice:
			return <MultipleChoiceForm onSave={onSave} question={question as MultipleChoiceQuestion} {...formProps} />;

		default:
			throw new Error(`Unsupported question kind "${kind}"`);
	}
};
