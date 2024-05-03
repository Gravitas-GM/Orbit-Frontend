import * as React from 'react';
import {Redirect, RouteComponentProps} from 'react-router';
import {Question, QuestionCreate, QuestionUpdate} from '../../../../Api/Survey/Models/BankQuestions';
import {Survey, SurveyModel} from '../../../../Api/Survey/Models/Surveys';
import {Classes} from '../../../../classes';
import {toaster} from '../../../../toaster';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {PageHeader} from '../../../PageHeader';
import {QuestionForm, SurveyEditorType} from '../QuestionForm';

interface IState {
	loading: boolean;
	processing: boolean;
	redirect: boolean;
	question: Question | null;
	survey: Survey | null;
}

interface RouteProps {
	question?: string;
}

export class NextSurveyQuestionEditor extends React.PureComponent<RouteComponentProps<RouteProps>, IState> {
	public state: Readonly<IState> = {
		loading: true,
		processing: false,
		redirect: false,
		question: null,
		survey: null,
	};

	public async componentDidMount() {
		const idParam = this.props.match.params.question;

		if (idParam) {
			try {
				await SurveyModel.readNextQuestion(idParam).then(r => this.setState({
					question: r.data,
				}));
			} catch (error) {
				toaster.showUnhandledErrorMessage();

				this.setState({
					redirect: true,
				});

				return;
			}
		}

		try {
			await SurveyModel.readNext().then(r => this.setState({
				survey: r.data,
			}));
		} catch (error) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				redirect: true,
			});

			return;
		}

		this.setState({
			loading: false,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;
		else if (this.state.redirect)
			return <Redirect to="/survey/next" />;

		return (
			<section className={Classes.PAGE_WRAPPER}>
				<PageHeader title={this.props.match.params.question ? `Edit Survey Question` : `New Survey Question`} />

				<QuestionForm
					processing={this.state.processing}
					question={this.state.question}
					onSave={this.onSave}
					survey={this.state.survey!.id.toString()}
					surveyEditorType={SurveyEditorType.NEXT}
				/>
			</section>
		);
	}

	private onSave = async (payload: QuestionCreate | QuestionUpdate) => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		try {
			if (this.state.question)
				await SurveyModel.updateNextQuestion(this.state.question.id, payload);
			else
				await SurveyModel.createNextQuestion(payload as QuestionCreate);
		} catch (error) {
			throw error;
		} finally {
			this.setState({
				processing: false,
			});
		}

		const action = this.state.question ? 'updated' : 'created';
		toaster.success(`Question ${action} successfullly.`);

		this.setState({
			redirect: true,
		});
	}
}
