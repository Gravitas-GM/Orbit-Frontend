import React from 'react';
import {PageHeader} from '../../../PageHeader';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {Icon, Intent} from '@blueprintjs/core';
import {Redirect, RouteComponentProps} from 'react-router';
import {QuizSubmission, QuizSubmissionModel} from '../../../../Api/Quiz/Models/QuizSubmissions';
import {QuizAnswers} from '../QuizAnswers';
import {toaster} from '../../../../toaster';
import {history} from '../../../../history';
import './QuizResultsPage.scss';
import {formatDate} from '../../../Utility/date';
import {LinkButton} from '../../../LinkButton';

interface IProps {
	submission?: string;
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

	public componentDidMount(): void {
		if (this.props.match.params.submission) {
			this.fetchSubmission(this.props.match.params.submission);
		}
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		if (!this.state.submission) {
			return <Redirect to="/quiz/history" />;
		}

		return (
			<section className="gm-page-wrapper">
				<PageHeader title={`Quiz Results - ${formatDate(this.state.submission.startTimestamp)}`} />

				<div className="results-header">
					<span>Score:</span>

					<span>
						<Icon icon="tick" /> {renderScore(this.state.submission)}
					</span>
				</div>

				<QuizAnswers questions={this.state.submission.questions} />

				<div style={{display: 'flex', justifyContent: 'center'}}>
					<LinkButton to="/quiz/history" intent={Intent.PRIMARY} text="View Submission History" />
				</div>
			</section>
		);
	}

	private fetchSubmission = async (submissionId: string) => {
		let submission: QuizSubmission | null = null;

		try {
			submission = await QuizSubmissionModel.read(submissionId).then(response => response.data);
		} catch (error) {
			toaster.error('Could not find specified quiz submission data');

			this.setState({
				loading: false,
			});
		}

		this.setState({
			loading: false,
			submission,
		});
	};
}

export const renderScore = (item: QuizSubmission) => {
	return (
		<span>
			{Math.floor((item.correctCount / item.questions.length) * 100)}% 
			({item.correctCount} / {item.questions.length})
		</span>
	);
};
