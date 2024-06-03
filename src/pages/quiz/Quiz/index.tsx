import * as React from 'react';
import {Navigate} from 'react-router-dom';
import {isValidationFailureError, ValidationFailures} from '../../../api/errors/symfony';
import {QuestionKind} from '../../../api/Quiz/Models/Questions';
import {Answer, Quiz, QuizModel} from '../../../api/Quiz/Models/Quiz';
import {QuizSubmission} from '../../../api/Quiz/Models/QuizSubmissions';
import {Classes} from '../../../classes';
import {PageHeader} from '../../../components/PageHeader';
import {Prompt} from '../../../components/Router/Prompt';
import {toaster} from '../../../toaster';
import './index.scss';
import {Questions, QuizItem} from './Questions';
import {Timer} from './Timer';

interface Props {
	quiz: Quiz,
}

interface State {
	redirectTo: string | null,
	validationFailures: ValidationFailures | null,
	expired: boolean,
}

export class QuizPage extends React.PureComponent<Props, State> {
	public state: Readonly<State> = {
		redirectTo: null,
		validationFailures: null,
		expired: false,
	};

	public render() {
		if (this.state.redirectTo)
			return <Navigate to={this.state.redirectTo} />;

		return (
			<>
				<Timer
					startTime={this.props.quiz.startTimestamp}
					endTime={this.props.quiz.endTimestamp}
					onExpired={this.onTimerExpired}
				/>

				<div className={Classes.PAGE_WRAPPER} id="quiz-form">
					<PageHeader title="Quiz" />

					<Questions
						questions={this.props.quiz.questions}
						validationFailures={this.state.validationFailures}
						onSubmit={this.onSubmit}
						expired={this.state.expired}
					/>
				</div>

				<Prompt
					when={this.state.redirectTo === null}
					message="Are you sure you want to leave? You have unsaved changes."
				/>
			</>
		);
	}

	private onTimerExpired = () => this.setState({
		expired: true,
	});

	private onSubmit = async (items: QuizItem[]) => {
		const responses: Array<Answer | null> = items.map(item => {
			// Unanswered items should be converted to `null`s, but ONLY when submitting an expired quiz.
			if (this.state.expired && item.answer === null)
				return null;

			switch (item.kind) {
				case QuestionKind.Boolean:
					return {
						id: item.prompt.id,
						kind: item.kind,
						answer: item.answer,
					};

				case QuestionKind.FreeText:
					return {
						id: item.prompt.id,
						kind: item.kind,
						answer: item.answer,
					};

				case QuestionKind.MultipleChoice:
					return {
						id: item.prompt.id,
						kind: item.kind,
						answerIndex: item.answer,
					};
			}
		});

		let submission: QuizSubmission;

		try {
			submission = await QuizModel.finish({
				responses,
			}).then(r => r.data);
		} catch (error) {
			if (isValidationFailureError(error)) {
				toaster.showValidationFailedErrorMessage();

				this.setState({
					validationFailures: error.context.failures,
				});
			} else
				toaster.showUnhandledErrorMessage();

			return;
		}

		this.setState({
			redirectTo: `/quiz/history/${submission.id}`,
		});
	};
}
