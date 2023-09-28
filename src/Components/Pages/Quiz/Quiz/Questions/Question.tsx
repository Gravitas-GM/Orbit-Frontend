import * as React from 'react';
import {QuizItem} from './index';
import {QuestionKind} from '../../../../../Api/Quiz/Models/Questions';
import {BooleanQuestion} from './BooleanQuestion';
import {FreeTextQuestion} from './FreeTextQuestion';
import {MultipleChoiceQuestion} from './MultipleChoiceQuestion';

interface Props {
	item: QuizItem,
	onChange: (item: QuizItem) => void,
}

export const Question: React.FC<Props> = ({item, onChange}) => {
	switch (item.kind) {
		case QuestionKind.Boolean:
			return <BooleanQuestion item={item} onChange={onChange} />;

		case QuestionKind.FreeText:
			return <FreeTextQuestion item={item} onChange={onChange} />;

		case QuestionKind.MultipleChoice:
			return <MultipleChoiceQuestion item={item} onChange={onChange} />;

		default:
			throw new Error('Unrecognized question kind');
	}
};
