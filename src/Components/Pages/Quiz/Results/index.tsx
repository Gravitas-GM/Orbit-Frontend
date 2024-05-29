import React from 'react';
import {PageHeader} from '../../../PageHeader';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {Intent} from '@blueprintjs/core';
import {Redirect, RouteComponentProps} from 'react-router';
import {QuizSubmission, QuizSubmissionModel} from '../../../../Api/Quiz/Models/QuizSubmissions';
import {toaster} from '../../../../toaster';
import './QuizResultsPage.scss';
import {formatDate, formatRemainingTime} from '../../../../utility/date';
import {LinkButton} from '../../../LinkButton';
import {Answers} from './Answers';

interface IProps {
	submission: string;
}

interface IState {
	loading: boolean;
	submission: QuizSubmission | null;
}

export class QuizResultsPage extends React.PureComponent<RouteComponentProps<IProps>, IState> {
	public state: Readonly<IState> = {
		loading: true,
		submission: null,
	};

	public async componentDidMount() {
		try {
			this.setState({
				submission: await QuizSubmissionModel.read(this.props.match.params.submission)
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
			return <Redirect to="/quiz/history" />;

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
		{Math.floor(item.correctCount / item.questionCount * 100)}% ({item.correctCount} / {item.questionCount})
	</span>
);
