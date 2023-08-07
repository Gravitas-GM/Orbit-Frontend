import React from "react";
import { PageHeader } from "../../../PageHeader";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { RouteComponentProps } from "react-router";
import { QuestionTag, QuestionTagModel } from "../../../../Api/Quiz/Models/QuestionTags";
import { Question, QuestionCreatePayload, QuestionModel } from "../../../../Api/Quiz/Models/Questions";
import { AnswerForm } from "./AnswerForm";
import { ValidationFailures, isValidationFailureError } from "../../../../Api/errors/symfony";
import * as toaster from "../../../../Toaster";
import { history } from "../../../../history";
import { AnchorButton, Callout, Intent } from "@blueprintjs/core";

interface IState {
	loading: boolean;
	processing: boolean;
	question: Question | null;
	tags: QuestionTag[];
	selectedTag?: QuestionTag;
	validationFailures: ValidationFailures | null;
}

interface IProps {
	question?: string;
}
export class QuestionEditorPage extends React.PureComponent<RouteComponentProps<IProps>, IState> {
	public state: Readonly<IState> = {
		loading: true,
		processing: false,
		question: null,
		tags: [],
		selectedTag: undefined,
		validationFailures: null,
	}

	public async componentDidMount() {
		if (this.props.match.params.question) {
			await Promise.all([this.fetchTags(), this.fetchQuestion()]);

			return;
		}

		await this.fetchTags();
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<section className="gm-page-wrapper">
				<PageHeader title={this.props.match.params.question ? `Edit Question` : `Add Question`} />

				{this.state.tags.length === 0 &&
					<Callout
						intent={Intent.WARNING}
						icon="warning-sign"
						title="No tags found"
					>
						Please add some tags before creating questions.

						<AnchorButton
							href="/quiz/tags/new"
							text="Add Tag"
							intent={Intent.PRIMARY}
						/>
					</Callout>
				}

				<AnswerForm
					tags={this.state.tags}
					processing={this.state.processing}
					question={this.state.question}
					saveQuestion={this.saveQuestion}
					validationFailures={this.state.validationFailures}
				/>
			</section>
		);
	}

	private fetchTags = async () => {
		try {
			const tags = await QuestionTagModel.list().then((res) => res.data);

			this.setState({
				tags,
				loading: false
			});
		} catch (err) {
			toaster.error("Error fetching tags");

			this.setState({
				loading: false
			});

			history.push("/");
		}
	};

	private fetchQuestion = async () => {
		this.setState({
			loading: true
		});

		let question: Question;

		try {
			question = await QuestionModel.read(this.props.match.params.question!).then((res) => res.data);

			this.setState({
				question: question,
			});
		} catch (err) {
			toaster.error("Error fetching question");

			this.setState({
				loading: false
			});

			history.push("/");

			return;
		}

		this.setState({
			question,
			loading: false,
		});
	};

	private saveQuestion = async (questionData: QuestionCreatePayload) => {
		this.setState({
			processing: true,
		});

		let question: Question;

		try {
			question = await QuestionModel.create(questionData).then((res) => res.data);
		} catch (err) {
			if (isValidationFailureError(err)) {
				toaster.error("Validation failed");

				this.setState({
					validationFailures: err.context.failures,
					processing: false,
				});
			} else {
				toaster.showUnhandledErrorMessage();
			}

			return;
		}

		this.setState({
			processing: false,
			question: question,
		});
	};
}
