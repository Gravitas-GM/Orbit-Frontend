import * as React from 'react';
import {Question, QuestionCreate} from '../../../../Api/Survey/Models/BankQuestions';
import {SurveyModel} from '../../../../Api/Survey/Models/Surveys';
import {Classes} from '../../../../classes';
import {PageHeader} from '../../../PageHeader';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {Redirect, RouteComponentProps} from 'react-router';
import {toaster} from '../../../../toaster';
import {BankQuestionForm} from '../SurveyBankEditor/BankQuestionForm';

interface IState {
	loading: boolean;
	processing: boolean;
	redirect: boolean;
	question: Question | null;
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

				<BankQuestionForm
					processing={this.state.processing}
					question={this.state.question}
					onSave={this.onSave}
					survey="next"
				/>
			</section>
		);
	}

	private onSave = async (payload: QuestionCreate) => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		try {
			if (this.state.question)
				await SurveyModel.updateNextQuestion(this.state.question.id, payload);
			else
				await SurveyModel.createNextQuestion(payload);
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
