import * as React from 'react';
import {ValidationFailures} from '../../../../Api/errors/symfony';
import {QuestionKind} from '../../../../Api/Quiz/Models/Questions';
import {BooleanQuestion} from './BooleanQuestion';
import {FreeTextQuestion} from './FreeTextQuestion';
import {QuizItem} from './index';
import {MultipleChoiceQuestion} from './MultipleChoiceQuestion';

interface Props {
	name: string,
	item: QuizItem,
	validationFailures: ValidationFailures | null,
}

export function Question({name, item, validationFailures}: Props): React.ReactElement {
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
}
