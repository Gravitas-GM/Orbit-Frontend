import React from "react";
import { PageHeader } from "../../../PageHeader";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { AnchorButton, Icon, Intent } from "@blueprintjs/core";
import { RouteComponentProps } from "react-router";
import { QuizSubmission, QuizSubmissionModel } from "../../../../Api/Quiz/Models/QuizSubmissions";
import * as toaster from "../../../../Toaster"
import { history } from "../../../../history";
import "./QuizResultsPage.scss";
import { quizSubmissionsMock } from "../../../../mocks/QuizSubmissions";
import { QuizAnswers } from "../QuizAnswers";
interface IProps {
	submission?: string;
}
interface IState {
	loading: boolean;
	justFinishedQuiz: boolean;
	submission: QuizSubmission | null;
}

export class QuizResultsPage extends React.PureComponent<RouteComponentProps<IProps>, IState> {
	public state: Readonly<IState> = {
		loading: false,
		justFinishedQuiz: true,
		submission: quizSubmissionsMock[0],
	};

	public componentDidMount(): void {
		if (this.props.match.params.submission) {
			this.getQuizResult(this.props.match.params.submission);
		}
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<section className="gm-page-wrapper">
				<PageHeader
					title={`Quiz #${this.state.submission?.id} Results`}
				/>


				<div className="results-header">
					<h2>
						<Icon icon="time" /> {`${new Date(this.state.submission!.timestamp).getSeconds()}s`}
					</h2>
					<h2>
						<Icon icon="tick" /> {showQuizScore(this.state.submission!)}
					</h2>
				</div>

				<QuizAnswers questions={this.state.submission!.questions} />

				<div
					style={{
						display: "flex",
						justifyContent: "center",
					}}
				>
					<AnchorButton
						href="/quiz/history"
						intent={Intent.PRIMARY}
						text="View Submission History"
					/>
				</div>
			</section>
		);
	}

	private getQuizResult = async (submissionId: string) => {
		this.setState({
			loading: true
		});

		let submission: QuizSubmission | null = null;

		try {
			submission = await QuizSubmissionModel.read(submissionId).then((res) => res.data);
		} catch (error) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				loading: false
			});

			history.push("/");
		}

		this.setState({
			loading: false,
			submission
		})
	};
}

export const showQuizScore = (item: QuizSubmission) => {
	return <span>{Math.floor((item.correctCount / item.questions.length)*100)}% ({item.correctCount} / {item.questions.length})</span>;
};
