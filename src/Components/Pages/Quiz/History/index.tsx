import {HTMLTable, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Redirect} from 'react-router';
import {User, UserModel} from '../../../../Api/Hub/Models/Users';
import {QuizSubmission, QuizSubmissionModel} from '../../../../Api/Quiz/Models/QuizSubmissions';
import {Permission, PermissionContext} from '../../../../Permission';
import {toaster} from '../../../../toaster';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {LinkButton} from '../../../LinkButton';
import {NonIdealState} from '../../../NonIdealState';
import {ObjectList} from '../../../ObjectList';
import {formatDateTime, formatDuration} from '../../../../utility/date';
import {renderScore} from '../Results';
import './QuizHistory.scss';
import {UserSelect} from './UserSelect';

interface IState {
	loading: boolean;
	processing: boolean;
	users: User[];
	submissions: QuizSubmission[];
	filteredSubmissions: QuizSubmission[] | null;
	selectedUser: User | null;
	redirect: string | null;
}

export class QuizHistoryPage extends React.PureComponent<{}, IState> {
	public static contextType = PermissionContext;
	declare context: React.ContextType<typeof PermissionContext>;

	public state: Readonly<IState> = {
		loading: false,
		processing: false,
		users: [],
		submissions: [],
		filteredSubmissions: null,
		selectedUser: null,
		redirect: null,
	};

	public async componentDidMount(): Promise<void> {
		this.setState({
			loading: true,
		});

		const promises: [Promise<QuizSubmission[]>, Promise<User[]> | undefined] = [
			QuizSubmissionModel.list().then(r => r.data),
			undefined,
		];

		const [isGranted] = this.context!;

		if (isGranted(Permission.ADMIN))
			promises[1] = UserModel.list().then(r => r.data);

		let submissions: QuizSubmission[];
		let users: User[] | undefined = undefined;

		try {
			[submissions, users] = await Promise.all(promises);
		} catch (e) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				redirect: '/',
			});

			return;
		}

		this.setState({
			submissions: submissions.sort((a, b) => b.endTimestamp.getTime() - a.endTimestamp.getTime()),
		});

		if (users) {
			const ids = submissions.map(item => item.user.id);

			this.setState({
				users: users.filter(user => ids.includes(user.id)),
			});
		}

		this.setState({
			loading: false,
		});
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;
		else if (this.state.redirect)
			return <Redirect to={this.state.redirect} />;

		if (this.state.submissions.length === 0) {
			return (
				<NonIdealState
					icon="wind"
					action={(
						<LinkButton to="/" intent={Intent.PRIMARY}>
							Back to the home page
						</LinkButton>
					)}
					title="No quiz history data found."
				/>
			);
		}

		const [isGranted] = this.context!;

		return (
			<section className="gm-page-wrapper">
				<ObjectList
					title="Quiz History"
					items={this.state.filteredSubmissions ?? this.state.submissions}
					controls={
						<UserSelect
							users={this.state.users}
							onUserSelect={this.onUserSelect}
							onUserClear={this.onUserClear}
							selectedUser={this.state.selectedUser}
						/>
					}
				>
					{items => (
						<HTMLTable striped={true}>
							<thead>
								<tr>
									{isGranted(Permission.ADMIN) && (
										<th style={{width: 220}}>Name</th>
									)}

									<th>Completed On</th>

									<th>Duration</th>

									<th>Score</th>

									<th
										style={{
											width: 100,
											textAlign: 'center',
										}}
									>
										View
									</th>
								</tr>
							</thead>

							<tbody>
								{items.map(submission => (
									<tr key={submission.id}>
										{isGranted(Permission.ADMIN) && (
											<td>{submission.user.name}</td>
										)}

										<td>{formatDateTime(submission.endTimestamp)}</td>

										<td>
											{formatDuration(submission.startTimestamp, submission.endTimestamp)}
											{submission.expired ? ' (timed out)' : ''}
										</td>

										<td>{renderScore(submission)}</td>

										<td style={{textAlign: 'center'}}>
											<LinkButton
												icon="eye-open"
												to={`/quiz/history/${submission.id}`}
												minimal={true}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</HTMLTable>
					)}
				</ObjectList>
			</section>
		);
	}

	private onUserClear = () => this.setState({
		filteredSubmissions: null,
		selectedUser: null,
	});

	private onUserSelect = (user: User) => this.setState(state => (
		{
			filteredSubmissions: state.submissions.filter(item => item.user.id === user.id),
			selectedUser: user,
		}
	));
}
