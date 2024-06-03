import {Button, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {ValidationFailures} from '../../../../api/errors/symfony';
import {QuestionKind} from '../../../../api/Quiz/Models/Questions';
import {
	BooleanAnswer,
	BooleanQuestionPrompt,
	FreeTextAnswer,
	FreeTextQuestionPrompt,
	MultipleChoiceAnswer,
	MultipleChoiceQuestionPrompt,
	QuestionPrompt,
} from '../../../../api/Quiz/Models/Quiz';
import {QuestionNavigator} from '../QuestionNavigator';
import './index.scss';
import {Question} from './Question';

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
	expired?: boolean,
}

export function Questions({questions, validationFailures, onSubmit, expired}: Props): React.ReactElement {
	const [items, setItems] = React.useState<QuizItem[]>([]);

	React.useEffect(() => {
		setItems(questions.map(item => (
			{
				kind: item.kind,
				prompt: item,
				answer: null,
			} as QuizItem
		)));
	}, [questions]);

	const [submitting, setSubmitting] = React.useState(false);

	const onSubmitClick = React.useCallback(async () => {
		setSubmitting(true);
		await onSubmit(items);
		setSubmitting(false);
	}, [items, onSubmit]);

	React.useEffect(() => {
		if (expired) {
			// noinspection JSIgnoredPromiseFromCall
			onSubmitClick();
		}
	}, [expired, onSubmitClick]);

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
				show={!!validationFailures}
				questions={items}
				onSubmit={onSubmitClick}
				processing={submitting}
			/>
		</div>
	);
}
