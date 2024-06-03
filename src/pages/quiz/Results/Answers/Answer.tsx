import * as React from 'react';
import {QuestionKind} from '../../../../api/Quiz/Models/Questions';
import {QuestionResponse} from '../../../../api/Quiz/Models/QuizSubmissions';
import {BooleanAnswer} from './BooleanAnswer';
import {MultipleChoiceAnswer} from './MultipleChoiceAnswer';
import {FreeTextAnswer} from './FreeTextAnswer';

interface Props {
	item: QuestionResponse,
	name: string,
}

export function Answer({item, ...answerProps}: Props): React.ReactElement {
	switch (item.kind) {
		case QuestionKind.Boolean:
			return <BooleanAnswer item={item} {...answerProps} />;

		case QuestionKind.FreeText:
			return <FreeTextAnswer item={item} {...answerProps} />;

		case QuestionKind.MultipleChoice:
			return <MultipleChoiceAnswer item={item} {...answerProps} />;

		default:
			throw new Error('Unrecognized question kind');
	}
}
