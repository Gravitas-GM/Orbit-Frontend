import * as React from 'react';
import {PageHeader} from '../../../PageHeader';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {Redirect, RouteComponentProps} from 'react-router';
import {QuestionTag, QuestionTagModel} from '../../../../Api/Quiz/Models/QuestionTags';
import {Question, QuestionCreate, QuestionModel, QuestionUpdate} from '../../../../Api/Quiz/Models/Questions';
import {AnswerForm} from './AnswerForm';
import {toaster} from '../../../../toaster';
import './QuestionEditor.scss';

interface IState {
	loading: boolean;
	processing: boolean;
	redirect: boolean;
	question: Question | null;
	tags: QuestionTag[];
	selectedTag?: QuestionTag;
}

interface RouteProps {
	question?: string;
}

export class QuestionEditorPage extends React.PureComponent<RouteComponentProps<RouteProps>, IState> {
	public state: Readonly<IState> = {
		loading: true,
		processing: false,
		redirect: false,
		question: null,
		tags: [],
		selectedTag: undefined,
	};

	public async componentDidMount() {
		const promises: Array<Promise<unknown>> = [
			QuestionTagModel.list().then(r => this.setState({
				tags: r.data,
			})),
		];

		const idParam = this.props.match.params.question;

		if (idParam) {
			promises.push(QuestionModel.read(idParam).then(r => this.setState({
				question: r.data,
			})));
		}

		try {
			await Promise.all(promises);
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
			return <Redirect to="/quiz/questions" />;

		return (
			<section className="gm-page-wrapper">
				<PageHeader title={this.props.match.params.question ? `Edit Question` : `New Question`} />

				<AnswerForm
					tags={this.state.tags}
					processing={this.state.processing}
					question={this.state.question}
					onSave={this.onSave}
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
				await QuestionModel.update(this.state.question.id, payload);
			else
				await QuestionModel.create(payload);
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
