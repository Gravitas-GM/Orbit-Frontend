import * as React from 'react';
import {Answer, isQuizNotReadyError, Quiz, QuizModel} from '../../../../Api/Quiz/Models/Quiz';
import {toaster} from '../../../../toaster';
import {Redirect} from 'react-router';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {PageHeader} from '../../../PageHeader';
import {Classes} from '../../../../classes';
import './index.scss';
import {Timer} from './Timer';
import {Questions, QuizItem} from './Questions';
import {isValidationFailureError, ValidationFailures} from '../../../../Api/errors/symfony';
import {QuizSubmission} from '../../../../Api/Quiz/Models/QuizSubmissions';
import {QuestionKind} from '../../../../Api/Quiz/Models/Questions';

interface State {
	quiz: Quiz | null,
	redirectTo: string | null,
	validationFailures: ValidationFailures | null,
}

export class QuizPage extends React.PureComponent<{}, State> {
	public state: Readonly<State> = {
		quiz: null,
		redirectTo: null,
		validationFailures: null,
	};

	public async componentDidMount() {
		try {
			this.setState({
				quiz: await QuizModel.start().then(r => r.data),
			});
		} catch (error) {
			if (isQuizNotReadyError(error))
				toaster.warning(error.message);
			else
				toaster.showUnhandledErrorMessage();

			this.setState({
				redirectTo: '/',
			});
		}
	}

	public render() {
		if (this.state.redirectTo)
			return <Redirect to={this.state.redirectTo} />;
		else if (this.state.quiz === null)
			return <FrameLoadingSpinner />;

		return (
			<>
				<Timer startTime={this.state.quiz.startTimestamp} endTime={this.state.quiz.endTimestamp} />

				<div className={Classes.PAGE_WRAPPER} id="quiz-form">
					<PageHeader title="Quiz" />

					<Questions
						questions={this.state.quiz.questions}
						validationFailures={this.state.validationFailures}
						onSubmit={this.onSubmit}
					/>
				</div>
			</>
		);
	}

	private onSubmit = async (items: QuizItem[]) => {
		const responses: Answer[] = items.map(item => {
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
