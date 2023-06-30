import React from "react";
import { UserContext } from "../../../../Session";
import { PageHeader } from "../../../PageHeader";
import { Button, Classes, Dialog, HTMLTable, Intent, MenuItem } from "@blueprintjs/core";
import { Select2 as Select, ItemRenderer } from "@blueprintjs/select";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { User, UserModel } from "../../../../Api/Hub/Models/Users";
import { ucwords } from "../../../Utility/string";
import { usersMock } from "../../../../mocks/User";
import { Permission } from "../../../../Permission";
import { quizSubmissionsMock } from "../../../../mocks/QuizSubmissions";
import { QuizSubmission } from "../../../../Api/Quiz/Models/QuizSubmissions";
import "./QuizHistory.scss";
import { Spacing } from "../../../../Styles/variables";
import { NonIdealState } from "../../../NonIdealState";
import { history } from "../../../../history";
import { QuestionsSummary } from "./QuestionsSummary";

interface IState {
	loading: boolean;
	processing: boolean;
	users: User[];
	filteredSubmissions: QuizSubmission[] | null;
	quizSubmissions: QuizSubmission[];
	currentSubmission: QuizSubmission | null;
	showQuizSubmissionDialog: boolean;
}

export class QuizHistoryPage extends React.PureComponent<null, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		loading: true,
		processing: false,
		users: [],
		filteredSubmissions: null,
		quizSubmissions: [],
		currentSubmission: null,
		showQuizSubmissionDialog: false,
	};

	public async componentDidMount(): Promise<void> {
		await this.fetchUserData();
	}

	private async fetchUserData(): Promise<void> {
		if (this.context?.permissions.includes(Permission.ADMIN)) {
			// make sure user is admin, then fetch all users and quiz submissions and enable filters

			// use all settled?
			// const users = await UserModel.list().then(res => res.data);
			// const quizSubmissions = await QuizHistoryModel.list(this.context.account.id).then(res => res.data);

			// mock data
			const users: User[] = usersMock;
			const quizSubmissions: QuizSubmission[] = quizSubmissionsMock;

			// filter out users that have not submitted a quiz
			const submissionUsers = quizSubmissions.map((submission) => submission.userId.id);
			const quizSubmissionUsers = users.filter((user) => submissionUsers.includes(user.id));

			this.setState({
				users: quizSubmissionUsers,
				quizSubmissions,
				filteredSubmissions: null,
				loading: false,
			});
		} else {
			// here we don't filter, neither show other users' submissions]
			// const quizSubmissions = await QuizHistoryModel.list(this.context.account.id).then(res => res.data);

			const users: User[] = [];
			const quizSubmissions: QuizSubmission[] = [];

			this.setState({
				users,
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
						<Button
							intent={Intent.PRIMARY}
							onClick={()=> history.push("/")}
						>
							Back to the home page
						</Button>
					}
					title="No quiz history data yet."
				/>
			)
		}

		return (
			<section className="gm-page-wrapper">
				<PageHeader title="Quiz - History" />

				<div className="history-filter">
					<span>Sort by</span>

					<Select<User>
						items={this.state.users}
						noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
						itemRenderer={renderUserOption}
						onItemSelect={this.handleUserSelect}
					>
						<Button>
							{this.state.filteredSubmissions
								? `${this.state.filteredSubmissions[0].userId.name}`
								: "All Users"}
						</Button>
					</Select>

					<Button minimal={true} small={true} onClick={this.clearFilter}>
						Clear filter
					</Button>
				</div>

				<HTMLTable striped={true} interactive={true}>
					<thead>
						<tr>
							<th>User</th>
							<th>Score</th>
							<th>Time</th>
							<th>Submission Date</th>
							<th>&nbsp;</th>
						</tr>
					</thead>

					<RenderHistoryItems
						items={
							this.state.filteredSubmissions ?
							this.state.filteredSubmissions :
							this.state.quizSubmissions
						}

						handleClick={this.onViewAnswersClick}
					/>
				</HTMLTable>

				{this.state.currentSubmission && (
					<Dialog
						onClose={this.onClose}
						isOpen={this.state.showQuizSubmissionDialog}
						title={`Quiz Submission #${this.state.currentSubmission.id} - ${this.state.currentSubmission.userId.name}`}
					>
						<div className={Classes.DIALOG_BODY}>
							<QuestionsSummary questions={this.state.currentSubmission.questions} />

							<hr style={{margin: `${Spacing.Large} 0`}} />

							<span className="question-details-label">Total correct count: {this.state.currentSubmission?.correctCount}</span>
						</div>
					</Dialog>
				)}
			</section>
		);
	}

	private clearFilter = () => {
		this.setState({
			filteredSubmissions: null,
		});
	};

	private handleUserSelect = (user: User) => {
		const filteredSubmissions = this.state.quizSubmissions.filter((submission) => submission.userId.id === user.id);

		if (filteredSubmissions) {
			this.setState({
				filteredSubmissions
			});
		}
	};

	private onClose = () => {
		this.setState({
			currentSubmission: null,
			showQuizSubmissionDialog: false,
		});
	};

	private onViewAnswersClick = (index: number) => {
		this.setState((state)=>{
			if (state.filteredSubmissions) {
				return {
					currentSubmission: state.filteredSubmissions[index],
					showQuizSubmissionDialog: true,
				}
			} else {
				return {
					currentSubmission: state.quizSubmissions[index],
					showQuizSubmissionDialog: true,
				}
			}
		});
	};
}

interface IRenderHistoryItemsProps {
	items: QuizSubmission[];

	handleClick: (index: number) => void;
}

const RenderHistoryItems: React.FC<IRenderHistoryItemsProps> = ({ items, handleClick }) => {
	const sortedItems = items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

	return (
		<tbody>
			{sortedItems.map((item, index) => (
				<tr key={`${item.userId.id} ${item.timestamp}`}>
					<td>{item.userId.name}</td>
					<td>{item.correctCount}</td>
					<td>{item.duration}</td>
					<td>{item.timestamp.toLocaleDateString()}</td>
					<td>
						<Button intent={Intent.PRIMARY} onClick={() => handleClick(index)}>
							View Answers
						</Button>
					</td>
				</tr>
			))}
		</tbody>
	);
};

const renderUserOption: ItemRenderer<User> = (user, { handleClick, handleFocus, modifiers }) => {
	if (!modifiers.matchesPredicate) return null;

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
