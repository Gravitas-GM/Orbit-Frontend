import {Intent} from '@blueprintjs/core';
import './QuizResultsPage.scss';
import React from 'react';
import {Navigate} from 'react-router-dom';
import {QuizSubmission, QuizSubmissionModel} from '../../../api/Quiz/Models/QuizSubmissions';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {LinkButton} from '../../../components/LinkButton';
import {PageHeader} from '../../../components/PageHeader';
import {withRouteParams, WithRouteParamsProps} from '../../../components/Router/withRouteParams';
import {toaster} from '../../../toaster';
import {formatDate, formatRemainingTime} from '../../../utility/date';
import {Answers} from './Answers';

interface RouteParams {
	submission: string,
}

interface IState {
	loading: boolean;
	submission: QuizSubmission | null;
}

class QuizResultsPage extends React.PureComponent<WithRouteParamsProps<RouteParams>, IState> {
	public state: Readonly<IState> = {
		loading: true,
		submission: null,
	};

	public async componentDidMount() {
		const id = this.props.params.submission;

		if (!id)
			throw new Error('Missing required route param `submission`');

		try {
			this.setState({
				submission: await QuizSubmissionModel.read(id)
					.then(r => r.data),
			});
		} catch {
			toaster.showUnhandledErrorMessage();
		} finally {
			// Failure state is detected by setting `state.loading` to `false` while leaving `state.submission` set to
			// `null`.
			this.setState({
				loading: false,
			});
		}
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;
		else if (this.state.submission === null)
			return <Navigate to="/quiz/history" />;

		const submission = this.state.submission;
		const duration = Math.floor((submission.endTimestamp.getTime() - submission.startTimestamp.getTime()) / 1000);

		return (
			<section className="gm-page-wrapper">
				<PageHeader title={`Quiz Results - ${formatDate(submission.endTimestamp)}`} />

				<div className="results-header">
					<strong>Score:</strong> {renderScore(submission)}
				</div>

				<div className="results-header">
					<strong>Duration:</strong> {formatRemainingTime(duration)}
				</div>

				<Answers items={submission.questions} />

				<div style={{display: 'flex', justifyContent: 'right'}}>
					<LinkButton to="/quiz/history" intent={Intent.PRIMARY} text="Done" />
				</div>
			</section>
		);
	}
}

export const renderScore = (item: QuizSubmission) => (
	<span>
		{item.questionCount ? Math.floor(item.correctCount / item.questionCount * 100) : 0}% ({item.correctCount} / {item.questionCount})
	</span>
);

const Wrapped = withRouteParams(QuizResultsPage);
export {Wrapped as QuizResultsPage};
