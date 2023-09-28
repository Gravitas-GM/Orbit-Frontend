import * as React from 'react';
import {Quiz, QuizModel} from '../../../../Api/Quiz/Models/Quiz';
import {toaster} from '../../../../toaster';
import {Redirect} from 'react-router';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {PageHeader} from '../../../PageHeader';
import {Classes} from '../../../../classes';
import './index.scss';
import {Timer} from './Timer';
import {Questions} from './Questions';

interface State {
	quiz: Quiz | null,
	redirectTo: string | null,
}

export class QuizPage extends React.PureComponent<{}, State> {
	public state: Readonly<State> = {
		quiz: null,
		redirectTo: null,
	};

	public async componentDidMount() {
		try {
			this.setState({
				quiz: await QuizModel.start().then(r => r.data),
			});
		} catch (error) {
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

					<Questions questions={this.state.quiz.questions} />
				</div>
			</>
		);
	}
}
