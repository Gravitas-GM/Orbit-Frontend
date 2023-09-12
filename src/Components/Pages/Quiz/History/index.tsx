import * as React from 'react';
import {UserContext} from '../../../../Session';
import {PageHeader} from '../../../PageHeader';
import {Button, HTMLTable, Intent, MenuItem} from '@blueprintjs/core';
import {Select2 as Select, ItemRenderer} from '@blueprintjs/select';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {User, UserModel} from '../../../../Api/Hub/Models/Users';
import {ucwords} from '../../../Utility/string';
import {Permission} from '../../../../Permission';
import {QuizSubmission, QuizSubmissionModel} from '../../../../Api/Quiz/Models/QuizSubmissions';
import './QuizHistory.scss';
import {NonIdealState} from '../../../NonIdealState';
import {history} from '../../../../history';
import * as toaster from '../../../../Toaster';
import {RenderHistoryItems} from './RenderHistoryItems';

interface IState {
	loading: boolean;
	processing: boolean;
	users: User[];
	filteredSubmissions: QuizSubmission[] | null;
	quizSubmissions: QuizSubmission[];
	currentSubmission: QuizSubmission | null;
	showQuizSubmissionDialog: boolean;
}

export class QuizHistoryPage extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		loading: false,
		processing: false,
		users: [],
		filteredSubmissions: null,
		quizSubmissions: [],
		currentSubmission: null,
		showQuizSubmissionDialog: false,
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
		let quizSubmissions: QuizSubmission[] = [];

		try {
			quizSubmissions = await QuizSubmissionModel.list().then((res) => res.data);
		} catch (e) {
			toaster.showUnhandledErrorMessage();

			return null;
		}

		return quizSubmissions;
	}

	private async fetchHistoryData(): Promise<void> {
		this.setState({loading: true});

		const quizSubmissions = await this.fetchQuizSubmissions();

		if (!quizSubmissions) {
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

			const submissionUsers = quizSubmissions.map((submission) => submission.user.id);

			this.setState((state)=> ({
				users: users.filter((user) => submissionUsers.includes(user.id)),
				quizSubmissions,
				filteredSubmissions: null,
				loading: false,
			}));
		} else {
			// here, since the user isn't an admin we aren't filtering other users' submissions
			// assuming the submissions endpoint return only the current user's submissions.
			// or do we need to filter them here as well?

			this.setState({
				quizSubmissions,
				loading: false,
			});
		}
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		if (this.state.quizSubmissions.length === 0) {
			return (
				<NonIdealState
					icon="wind"
					action={
						<Button intent={Intent.PRIMARY} onClick={() => history.push('/')}>
							Back to the home page
						</Button>
					}
					title="No quiz history data found."
				/>
			);
		}

		return (
			<section className="gm-page-wrapper">
				<PageHeader title="Quiz - History" />

				{this.context?.permissions.includes(Permission.ADMIN) ? (
					<div className="history-filter">
						<span>Sort by</span>

						<Select<User>
							items={this.state.users}
							noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
							itemRenderer={renderUserOption}
							onItemSelect={this.onUserSelect}
						>
							<Button>
								{
									this.state.filteredSubmissions && this.state.filteredSubmissions.length === 1
										? `${this.state.filteredSubmissions[0].user.name}`
										: 'All Users'
								}
							</Button>
						</Select>

						<Button minimal={true} small={true} onClick={this.clearFilter}>
							Clear filter
						</Button>
					</div>
				) : (
					''
				)}

				<HTMLTable striped={true} interactive={true}>
					<thead>
						<tr>
							{
								this.context?.permissions.includes(Permission.ADMIN) &&

								<th>Name</th>
							}

							<th>Quiz Date</th>
							<th>Score</th>
							<th>&nbsp;</th>
						</tr>
					</thead>

					<RenderHistoryItems
						items={
							this.state.filteredSubmissions ?
								this.state.filteredSubmissions :
								this.state.quizSubmissions
						}
					/>
				</HTMLTable>
			</section>
		);
	}

	private clearFilter = () => {
		this.setState({
			filteredSubmissions: null,
		});
	};

	private onUserSelect = (user: User) => {
		this.setState(state => ({
			filteredSubmissions: state.quizSubmissions.filter((submission) => submission.user.id === user.id),
		}));
	};
}

const renderUserOption: ItemRenderer<User> = (user, { handleClick, handleFocus, modifiers }) => {
	if (!modifiers.matchesPredicate)
		return null;

	return (
		<MenuItem
			active={modifiers.active}
			disabled={modifiers.disabled}
			key={user.id}
			onClick={handleClick}
			onFocus={handleFocus}
			roleStructure="listoption"
			text={ucwords(`${user.firstName} ${user.lastName}`)}
		/>
	);
};
