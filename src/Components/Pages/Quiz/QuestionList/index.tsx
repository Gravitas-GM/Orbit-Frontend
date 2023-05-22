import React from "react";
import { PageHeader } from "../../../PageHeader";
import { Button, HTMLTable, InputGroup } from "@blueprintjs/core";
import { Spacing } from "../../../../Styles/variables";
import { NonIdealState } from "../../../NonIdealState";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { history } from "../../../../history";
import { Question, QuestionModel } from "../../../../Api/Quiz/Models/Questions";

// temporary dummy data and interfaces
import { questions as mockQuestions } from "../../../../mocks/Questions";
export interface User {
    id: number,
    name: string,
    nextQuizTimestamp: Date,
    assignedTags: QuestionTag[],
}

export interface QuestionTag {
    id: number,
    label: string,
    members: User[],
}
// end temporary dummy data and interfaces

interface IQuestionListState {
	questions: Question[],
	loading: boolean,
	filteredQuestions: Question[],
	currentPage: number,
	totalPages: number,
 };

const ITEMS_PER_PAGE = 10;

export class QuestionListPage extends React.PureComponent<{}, IQuestionListState> {
	public state: Readonly<IQuestionListState> = {
		loading: false,
		questions: [],
		filteredQuestions: [],
		currentPage: 1,
		totalPages: 1,
	};

	public async componentDidMount() {
		// temporary fetch questions
		await this.fetchQuestions();
	};

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		const { currentPage, totalPages, filteredQuestions } = this.state;
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		const currrentPageItems = this.state.filteredQuestions.slice(startIndex, endIndex);

		return (
			<section className="gm-page-wrapper">
				<PageHeader title="Quiz - Questions List">
					<div style={{ display: "flex", flexDirection: "column", gap: Spacing.l}}>
						<InputGroup
							type="search"
							leftIcon="search"
							placeholder="Search questions"
							onChange={this.onSearchChange}
						/>
						<Button icon="add" onClick={this.onAddQuestionClick}>Add New</Button>
					</div>
				</PageHeader>

				<RenderPageItems
					items={currrentPageItems}
					deleteCallback={this.onDeleteClick}
					editCallback={this.onEditClick}
				/>

				{filteredQuestions.length > ITEMS_PER_PAGE ? <div className="pagination-container">
					<Button
						disabled={this.state.currentPage === 1}
						onClick={this.onClickBack}
						icon="caret-left"
					>
						Prev
					</Button>

					<span>
						{currentPage}/{totalPages}
					</span>

					<Button
						disabled={this.state.currentPage >= totalPages}
						onClick={this.onClickNext}
						rightIcon="caret-right"
					>
						Next
					</Button>
				</div> : "" }
			</section>
		);
	};

	private fetchQuestions = async () => {
		//  mock fetch questions
		this.setState({ loading: true });

		let questions: Question[] = [];

		try {
			// questions = await QuestionModel.list().then(response => response.data);
			questions = mockQuestions;
		} catch (error) {
			console.error(error);
			this.setState({ loading: false });
			return;
		}

		const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);

		this.setState({
			questions: questions,
			filteredQuestions: questions,
			totalPages,
			loading: false
		});
	;}

	private onAddQuestionClick = () => {
		history.push('/quiz/questions/new');
	};

	private onEditClick = (questionId: number) => {
		history.push(`/quiz/questions/${questionId}`);
	};

	private onDeleteClick = (question: Question) => {
		return;
	};

	private onClickNext = () => {
		if (this.state.currentPage === this.state.totalPages)
			return;

		this.setState(state => ({
			currentPage: state.currentPage + 1
		}));
	};

	private onClickBack = () => {
		if (this.state.currentPage === 1)
			return;

		this.setState(state => ({
			currentPage: state.currentPage - 1
		}));
	};

	private onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.currentTarget.value === '') {
			const totalPages = Math.ceil(this.state.questions.length / ITEMS_PER_PAGE);

			this.setState({
				filteredQuestions: this.state.questions,
				currentPage: 1,
				totalPages,
			});

			return;
		}

		const filteredQuestions = this.state.questions.filter(question =>
			question.prompt.toLocaleLowerCase().includes(event.currentTarget.value.toLocaleLowerCase())
		);

		const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);

		this.setState({
			filteredQuestions,
			currentPage: 1,
			totalPages,
		});
	};
}

interface IRenderPageItemsProps {
	items: Question[],
	editCallback: (questionId: number) => void,
	deleteCallback: (question: Question) => void,
}

// maybe this one can become an external component for all situations that require a list of items to be rendered
const RenderPageItems: React.FC<IRenderPageItemsProps> = ({items, editCallback, deleteCallback}) => {
	if (items.length === 0)
		return <NonIdealState title="No questions found" />;

	return (
		<HTMLTable striped={true}>
			<thead>
				<tr>
					<th>Prompt</th>
					<th>Tag</th>
					<th>Actions</th>
				</tr>
			</thead>

			<tbody>
				{items.map(question => (
					<tr key={question.id}>
						<td>{question.prompt}</td>

						<td style={{ width: 240}}>{question.tag.name}</td>

						<td style={{ width: 80}}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<Button icon="edit" minimal={true} onClick={() => editCallback(question.id)} />

								<Button icon="trash" minimal={true} onClick={() => deleteCallback(question)} />
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</HTMLTable>
	);
};
