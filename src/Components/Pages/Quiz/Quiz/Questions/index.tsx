import * as React from 'react';
import {QuestionKind} from '../../../../../Api/Quiz/Models/Questions';
import {
	BooleanAnswer,
	BooleanQuestionPrompt,
	FreeTextAnswer,
	FreeTextQuestionPrompt,
	MultipleChoiceAnswer,
	MultipleChoiceQuestionPrompt,
	QuestionPrompt,
} from '../../../../../Api/Quiz/Models/Quiz';
import {Question} from './Question';
import {replace} from '../../../../Utility/array';

interface Item<Kind extends QuestionKind> {
	kind: Kind,
	prompt: Kind extends QuestionKind.Boolean ? BooleanQuestionPrompt :
		Kind extends QuestionKind.FreeText ? FreeTextQuestionPrompt :
			Kind extends QuestionKind.MultipleChoice ? MultipleChoiceQuestionPrompt :
				never,
	answer: (Kind extends QuestionKind.Boolean ? BooleanAnswer['response'] :
		Kind extends QuestionKind.FreeText ? FreeTextAnswer['response'] :
			Kind extends QuestionKind.MultipleChoice ? MultipleChoiceAnswer['response'] :
				never) | null,
}

export type BooleanItem = Item<QuestionKind.Boolean>;
export type FreeTextItem = Item<QuestionKind.FreeText>;
export type MultipleChoiceItem = Item<QuestionKind.MultipleChoice>;

export type QuizItem = BooleanItem | FreeTextItem | MultipleChoiceItem;

interface Props {
	questions: QuestionPrompt[],
}

export const Questions: React.FC<Props> = ({questions}) => {
	const [items, setItems] = React.useState<QuizItem[]>([]);

	React.useEffect(() => {
		setItems(questions.map(item => ({
			kind: item.kind,
			prompt: item,
			answer: null,
		} as QuizItem)));
	}, [questions]);

	const onResponseChange = React.useCallback((item: QuizItem) => {
		setItems(replace(items, item, {...item}));
	}, [items]);

	return (
		<div>
			{items.map(item => (
				<Question key={item.prompt.id} item={item} onChange={onResponseChange} />
			))}
		</div>
	);
};
