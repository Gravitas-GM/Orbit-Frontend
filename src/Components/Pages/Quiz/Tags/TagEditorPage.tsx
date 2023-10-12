import * as React from 'react';
import {User, UserModel} from '../../../../Api/Hub/Models/Users';
import {QuestionTag, QuestionTagModel} from '../../../../Api/Quiz/Models/QuestionTags';
import {UserContext} from '../../../../Session';
import {PageHeader} from '../../../PageHeader';
import * as toaster from '../../../../Toaster';
import {Redirect, RouteComponentProps} from 'react-router';
import {TagEditorForm} from './TagEditorForm';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';

interface IState {
	loading: boolean;
	users: User[];
	tag?: QuestionTag;
	redirect: boolean;
}

interface RouteProps {
	tag?: string;
}

enum TagEditorPageTitle {
	ADD = 'Add New Tag',
	EDIT = 'Edit Tag',
}

export class TagEditorPage extends React.PureComponent<RouteComponentProps<RouteProps>, IState> {
	public state: Readonly<IState> = {
		loading: true,
		users: [],
		tag: undefined,
		redirect: false,
	};

	public static contextType = UserContext;

	public async componentDidMount() {

		const idParam = this.props.match.params.tag;

		const promises: Array<Promise<unknown>> = [
			UserModel.list().then(r =>
				this.setState({
					users: r.data,
				})
			),
		];

		if (idParam) {
			promises.push(
				QuestionTagModel.read(idParam).then(r =>
					this.setState({
						tag: r.data,
					})
				),
			)
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
			return <Redirect to="/quiz/tags" />;

		return (
			<section className="gm-page-wrapper">
				<PageHeader title={this.props.match.params.tag ? TagEditorPageTitle.EDIT : TagEditorPageTitle.ADD} />

				<TagEditorForm tag={this.state.tag} users={this.state.users} />
			</section>
		);
	}
}
