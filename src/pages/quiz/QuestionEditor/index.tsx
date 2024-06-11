import * as React from 'react';
import {Navigate} from 'react-router-dom';
import {Question, QuestionCreate, QuestionModel} from '../../../api/Quiz/Models/Questions';
import {QuestionTag, QuestionTagModel} from '../../../api/Quiz/Models/QuestionTags';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {PageHeader} from '../../../components/PageHeader';
import {withRouteParams, WithRouteParamsProps} from '../../../components/Router/withRouteParams';
import {toaster} from '../../../toaster';
import {AnswerForm} from './AnswerForm';
import './QuestionEditor.scss';

interface State {
	loading: boolean;
	processing: boolean;
	redirect: boolean;
	question: Question | null;
	tags: QuestionTag[];
	selectedTag?: QuestionTag;
}

interface RouteParams {
	question?: string;
}

class QuestionEditorPage extends React.PureComponent<WithRouteParamsProps<RouteParams>, State> {
	public state: Readonly<State> = {
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

		const idParam = this.props.params.question;

		if (!idParam)
			throw new Error('Cannot load editor without an ID argument');

		if (idParam !== 'new') {
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
			return <Navigate to="/quiz/questions" />;

		return (
			<section className="gm-page-wrapper">
				<PageHeader title={this.props.params.question !== 'new' ? `Edit Question` : `New Question`} />

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
	};
}

const Wrapped = withRouteParams(QuestionEditorPage);
export {Wrapped as QuestionEditorPage};
