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
import './index.scss';
import {ValidationFailures} from '../../../../../Api/errors/symfony';
import {Button, Intent} from '@blueprintjs/core';
import { QuestionNavigator } from '../QuestionNavigator';

interface Item<Kind extends QuestionKind> {
	kind: Kind,
	prompt: Kind extends QuestionKind.Boolean ? BooleanQuestionPrompt :
		Kind extends QuestionKind.FreeText ? FreeTextQuestionPrompt :
			Kind extends QuestionKind.MultipleChoice ? MultipleChoiceQuestionPrompt :
				never,
	answer: (Kind extends QuestionKind.Boolean ? BooleanAnswer['answer'] :
		Kind extends QuestionKind.FreeText ? FreeTextAnswer['answer'] :
			Kind extends QuestionKind.MultipleChoice ? MultipleChoiceAnswer['answerIndex'] :
				never) | null,
}

export type BooleanItem = Item<QuestionKind.Boolean>;
export type FreeTextItem = Item<QuestionKind.FreeText>;
export type MultipleChoiceItem = Item<QuestionKind.MultipleChoice>;

export type QuizItem = BooleanItem | FreeTextItem | MultipleChoiceItem;

interface Props {
	questions: QuestionPrompt[],
	validationFailures: ValidationFailures | null,
	onSubmit: (items: QuizItem[]) => Promise<void>,
}

export const Questions: React.FC<Props> = ({questions, validationFailures, onSubmit}) => {
	const [items, setItems] = React.useState<QuizItem[]>([]);

	const [showQuestionNavigator, setShowQuestionNavigator] = React.useState(false);

	React.useEffect(() => {
		setItems(questions.map(item => ({
			kind: item.kind,
			prompt: item,
			answer: null,
		} as QuizItem)));
	}, [questions]);

	const [submitting, setSubmitting] = React.useState(false);
	const onSubmitClick = React.useCallback(async () => {
		setSubmitting(true);

		const unanswered = items.filter(item => item.answer === null);

		if (unanswered.length > 0) {
			setSubmitting(false);

			setShowQuestionNavigator(true);

			return;
		}

		await onSubmit(items);
		setSubmitting(false);
	}, [items]);

	const onDismiss = React.useCallback(() => {
		setShowQuestionNavigator(false);
	}, []);

	return (
		<div>
			{items.map((item, index) => (
				<Question
					key={item.prompt.id}
					name={`responses[${index}]`}
					item={item}
					validationFailures={validationFailures}
				/>
			))}

			<div>
				<Button text="Submit" onClick={onSubmitClick} loading={submitting} intent={Intent.PRIMARY} />
			</div>

			<QuestionNavigator
				show={showQuestionNavigator}
				questions={items}
				dismiss={onDismiss}
			/>
		</div>
	);
};
