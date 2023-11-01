import * as React from 'react';
import {QuestionResponse} from '../../../../../Api/Quiz/Models/QuizSubmissions';
import {QuestionKind} from '../../../../../Api/Quiz/Models/Questions';
import {BooleanAnswer} from './BooleanAnswer';
import {MultipleChoiceAnswer} from './MultipleChoiceAnswer';
import {FreeTextAnswer} from './FreeTextAnswer';

interface Props {
	item: QuestionResponse,
	name: string,
}

export const Answer: React.FC<Props> = ({item, ...answerProps}) => {
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
};

Answer.displayName = 'Answer';
