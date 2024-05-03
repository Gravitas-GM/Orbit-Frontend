import * as React from 'react';
import {Redirect, RouteComponentProps} from 'react-router';
import {BankQuestionModel, Question, QuestionCreate, QuestionUpdate} from '../../../../Api/Survey/Models/BankQuestions';
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
}

interface RouteProps {
	survey: string;
	question?: string;
}

export class BankQuestionEditor extends React.PureComponent<RouteComponentProps<RouteProps>, IState> {
	public state: Readonly<IState> = {
		loading: true,
		processing: false,
		redirect: false,
		question: null,
	};

	public async componentDidMount() {
		const idParam = this.props.match.params.question;

		if (idParam) {
			try {
				await BankQuestionModel.read(idParam).then(r => this.setState({
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

		this.setState({
			loading: false,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;
		else if (this.state.redirect)
			return <Redirect to="/survey/bank" />;

		return (
			<section className={Classes.PAGE_WRAPPER}>
				<PageHeader title={this.props.match.params.question ? `Edit Bank Question` : `New Bank Question`} />

				<QuestionForm
					processing={this.state.processing}
					question={this.state.question}
					onSave={this.onSave}
					survey={this.props.match.params.survey}
					surveyEditorType={SurveyEditorType.BANK}
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
				await BankQuestionModel.update(this.state.question.id, payload);
			else
				await BankQuestionModel.create(payload as QuestionCreate);
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
