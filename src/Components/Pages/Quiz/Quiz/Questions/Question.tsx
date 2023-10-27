import * as React from 'react';
import {QuizItem} from './index';
import {QuestionKind} from '../../../../../Api/Quiz/Models/Questions';
import {BooleanQuestion} from './BooleanQuestion';
import {FreeTextQuestion} from './FreeTextQuestion';
import {MultipleChoiceQuestion} from './MultipleChoiceQuestion';
import {ValidationFailures} from '../../../../../Api/errors/symfony';

interface Props {
	name: string,
	item: QuizItem,
	validationFailures: ValidationFailures | null,
}

export const Question: React.FC<Props> = ({name, item, validationFailures}) => {
	switch (item.kind) {
		case QuestionKind.Boolean:
			return <BooleanQuestion name={name} item={item} validationFailures={validationFailures} />;

		case QuestionKind.FreeText:
			return <FreeTextQuestion name={name} item={item} validationFailures={validationFailures} />;

		case QuestionKind.MultipleChoice:
			return <MultipleChoiceQuestion name={name} item={item} validationFailures={validationFailures} />;

		default:
			throw new Error('Unrecognized question kind');
	}
};
