import * as React from 'react';
import {QuizItem} from './index';
import {QuestionKind} from '../../../../../Api/Quiz/Models/Questions';
import {BooleanQuestion} from './BooleanQuestion';
import {FreeTextQuestion} from './FreeTextQuestion';
import {MultipleChoiceQuestion} from './MultipleChoiceQuestion';
import {ValidationFailures} from '../../../../../Api/errors/symfony';

interface Props {
	item: QuizItem,
	validationFailures: ValidationFailures | null,
}

export const Question: React.FC<Props> = ({item, validationFailures}) => {
	switch (item.kind) {
		case QuestionKind.Boolean:
			return <BooleanQuestion item={item} />;

		case QuestionKind.FreeText:
			return <FreeTextQuestion item={item} validationFailures={validationFailures} />;

		case QuestionKind.MultipleChoice:
			return <MultipleChoiceQuestion item={item} />;

		default:
			throw new Error('Unrecognized question kind');
	}
};
