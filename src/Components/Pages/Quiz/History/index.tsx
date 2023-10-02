import * as React from 'react';
import {UserContext} from '../../../../Session';
import {Button, HTMLTable, Intent} from '@blueprintjs/core';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {User, UserModel} from '../../../../Api/Hub/Models/Users';
import {Permission} from '../../../../Permission';
import {QuizSubmission, QuizSubmissionModel} from '../../../../Api/Quiz/Models/QuizSubmissions';
import './QuizHistory.scss';
import {NonIdealState} from '../../../NonIdealState';
import {history} from '../../../../history';
import * as toaster from '../../../../Toaster';
import { LinkButton } from '../../../LinkButton';
import { ObjectList } from '../../../ObjectList';

interface IState {
	loading: boolean;
	processing: boolean;
	users: User[];
	submissions: QuizSubmission[];
}

export class QuizHistoryPage extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		loading: false,
		processing: false,
		users: [],
		submissions: [],
	};

	public async componentDidMount(): Promise<void> {
		await this.fetchHistoryData();
	}

	private async fetchUserData(): Promise<User[] | null> {
		let users: User[] = [];

		try {
			users = await UserModel.list().then((res) => res.data);
		} catch (err) {
			toaster.showUnhandledErrorMessage();

			return null;
		}

		return users;
	}

	private async fetchQuizSubmissions(): Promise<QuizSubmission[] | null> {
		let submissions: QuizSubmission[] = [];

		try {
			submissions = await QuizSubmissionModel.list().then((res) => res.data);
		} catch (e) {
			toaster.showUnhandledErrorMessage();

			return null;
		}

		return submissions;
	}

	private async fetchHistoryData(): Promise<void> {
		this.setState({loading: true});

		const submissions = await this.fetchQuizSubmissions();

		if (!submissions) {
			this.setState({loading: false});

			return;
		}

		if (this.context?.permissions.includes(Permission.ADMIN)) {
			const users = await this.fetchUserData();

			if (!users) {
				this.setState({
					loading: false
				});

				return;
			}

			const submissionUsers = submissions.map((submission) => submission.user.id);

			this.setState((state)=> ({
				users: users.filter((user) => submissionUsers.includes(user.id)),
				submissions,
				loading: false,
			}));
		} else {
			// here, since the user isn't an admin we aren't filtering other users' submissions
			// assuming the submissions endpoint return only the current user's submissions.
			// or do we need to filter them here as well?

			this.setState({
				submissions,
				loading: false,
			});
		}
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		if (this.state.submissions.length === 0) {
			return (
				<NonIdealState
					icon="wind"
					action={(
						<Button intent={Intent.PRIMARY} onClick={() => history.push('/')}>
							Back to the home page
						</Button>
					)}
					title="No quiz history data found."
				/>
			);
		}

		return (
			<section className="gm-page-wrapper">
				<ObjectList
					title="Quiz History"
					editorUrlPrefix="/quiz/history"
					items={this.state.submissions}
					onItemFilter={this.onItemFilter}
				>
					{items => (
						<HTMLTable striped={true}>
							<thead>
								<tr>
									{
										this.context?.permissions.includes(Permission.ADMIN) &&

										<th style={{ width: 220 }}>Name</th>
									}

									<th>Quiz Date</th>
									<th style={{ width: 120 }}>Score</th>
									<th style={{ width: 120 }}>&nbsp;</th>
								</tr>
							</thead>

							{items.map((submission) => (
								<tr key={submission.id}>
									{
										this.context?.permissions.includes(Permission.ADMIN) &&

										<td>{submission.user.name}</td>
									}

									<td>{new Date(submission.timestamp).toLocaleDateString()}</td>
									<td>
										{submission.correctCount}
									</td>
									<td>
										<LinkButton
											to={`/quiz/history/${submission.id}`}
											intent={Intent.PRIMARY}
											small={true}
										>
											View
										</LinkButton>
									</td>
								</tr>
							))}
						</HTMLTable>
					)}
				</ObjectList>
			</section>
		);
	}
	private onItemFilter = (item: QuizSubmission, searchText: string) => item.user.name.toLocaleLowerCase().includes(searchText);
}
