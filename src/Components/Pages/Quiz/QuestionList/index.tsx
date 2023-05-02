import React from "react";
import { PageHeader } from "../../../PageHeader";
import { Button, HTMLTable, InputGroup } from "@blueprintjs/core";
import { Spacing } from "../../../../Styles/variables";
import { NonIdealState } from "../../../NonIdealState";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { history } from "../../../../history";

// temporary dummy data and interfaces

export interface Settings {
    accountId: number,
    quizFrequency: Frequency,
    questionCount: number,
    completedRewardPointSourceId: string|null,
}

export interface User {
    id: number,
    name: string,
    nextQuizTimestamp: Date,
    assignedTags: QuestionTag[],
}

export enum Frequency {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
}

interface BaseQuestion {
    id: number,
    tagId: number|null,
    prompt: string,
    kind: QuestionKind,
}

export enum QuestionKind {
    FreeText = 'free text',
    Boolean = 'boolean',
    MultipleChoice = 'multiple choice',
}

export interface FreeTextQuestion extends BaseQuestion {
    kind: QuestionKind.FreeText,
    answers: string[],
}

export interface BooleanQuestion extends BaseQuestion {
    kind: QuestionKind.Boolean,
    answer: boolean,
    trueLabel: string|null,
    falseLabel: string|null,
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    kind: QuestionKind.MultipleChoice,
    choices: string[],
    answerIndex: number,
}

export type Question = FreeTextQuestion | BooleanQuestion | MultipleChoiceQuestion;

export interface QuestionTag {
    id: number,
    label: string,
    members: User[],
}

export interface QuizSubmission {
    id: number,
    user: User,
    timestamp: Date,
    correctCount: number,
    questions: QuestionResponse[],
}

interface BaseQuestionResponse extends Omit<BaseQuestion, 'tagId' | 'kind'> {
    correct: boolean,
}

export interface FreeTextResponse extends BaseQuestionResponse, Omit<FreeTextQuestion, 'tagId'> {
    response: string,
}

export interface BooleanResponse extends BaseQuestionResponse, Omit<BooleanQuestion, 'tagId'> {
    response: boolean,
}

export interface MultipleChoiceResponse extends BaseQuestionResponse, Omit<MultipleChoiceQuestion, 'tagId'> {
    response: number,
}

export type QuestionResponse = FreeTextResponse | BooleanResponse | MultipleChoiceResponse;

const questions: Question[] = [
	{
		id: 1,
		tagId: 1,
		prompt: 'What is the capital of the United States?',
		kind: QuestionKind.FreeText,
		answers: ['Washington, D.C.'],
	},
	{
		id: 2,
		tagId: 1,
		prompt: 'What is the capital of Canada?',
		kind: QuestionKind.FreeText,
		answers: ['Ottawa'],
	},
	{
		id: 3,
		tagId: 1,
		prompt: 'What is the capital of Mexico?',
		kind: QuestionKind.FreeText,
		answers: ['Mexico City'],
	},
	{
		id: 4,
		tagId: 1,
		prompt: 'What is the capital of Brazil?',
		kind: QuestionKind.FreeText,
		answers: ['Brasilia'],
	},
	{
		id: 5,
		tagId: 1,
		prompt: 'What is the capital of Argentina?',
		kind: QuestionKind.FreeText,
		answers: ['Buenos Aires'],
	},
	{
		id: 6,
		tagId: 1,
		prompt: 'What is the capital of Chile?',
		kind: QuestionKind.FreeText,
		answers: ['Santiago'],
	},
	{
		id: 7,
		tagId: 1,
		prompt: 'What is the capital of Peru?',
		kind: QuestionKind.FreeText,
		answers: ['Lima'],
	},
	{
		id: 8,
		tagId: 1,
		prompt: 'What is the capital of Colombia?',
		kind: QuestionKind.FreeText,
		answers: ['Bogota'],
	},
	{
		id: 9,
		tagId: 1,
		prompt: 'What is the capital of Venezuela?',
		kind: QuestionKind.FreeText,
		answers: ['Caracas'],
	},
	{
		id: 10,
		tagId: 1,
		prompt: 'What is the capital of Ecuador?',
		kind: QuestionKind.FreeText,
		answers: ['Quito'],
	},
	{
		id: 11,
		tagId: 1,
		prompt: 'What is the capital of Bolivia?',
		kind: QuestionKind.FreeText,
		answers: ['La Paz'],
	},
	{
		id: 12,
		tagId: 1,
		prompt: 'What is the capital of Paraguay?',
		kind: QuestionKind.FreeText,
		answers: ['Asuncion'],
	},
	{
		id: 13,
		tagId: 1,
		prompt: 'What is the capital of Uruguay?',
		kind: QuestionKind.FreeText,
		answers: ['Montevideo'],
	},
	{
		id: 14,
		tagId: 1,
		prompt: 'What is the capital of Guyana?',
		kind: QuestionKind.FreeText,
		answers: ['Georgetown'],
	},
	{
		id: 15,
		tagId: 1,
		prompt: 'What is the capital of Suriname?',
		kind: QuestionKind.FreeText,
		answers: ['Paramaribo'],
	},
	{
		id: 16,
		tagId: 1,
		prompt: 'What is the capital of French Guiana?',
		kind: QuestionKind.FreeText,
		answers: ['Cayenne'],
	},
	{
		id: 17,
		tagId: 1,
		prompt: 'What is the capital of Cuba?',
		kind: QuestionKind.FreeText,
		answers: ['Havana'],
	},
	{
		id: 18,
		tagId: 1,
		prompt: 'What is the capital of the Dominican Republic?',
		kind: QuestionKind.FreeText,
		answers: ['Santo Domingo'],
	}
];
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

		const { currentPage, totalPages } = this.state;
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
						<Button icon="add">Add New</Button>
					</div>
				</PageHeader>

				<div className="question-list">
					<HTMLTable striped={true}>
						<thead>
							<tr>
								<th>Id</th>
								<th>Prompt</th>
								<th>Tags</th>
								<th>Actions</th>
							</tr>
						</thead>

						<tbody>
							<RenderPageItems
								items={currrentPageItems}
								editCallback={this.onEditClick}
								deleteCallback={this.onDeleteClick}
							/>
						</tbody>
					</HTMLTable>

					<div className="pagination-container">
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
					</div>
				</div>
			</section>
		);
	};

	private fetchQuestions = async () => {
		this.setState({ loading: true });
		const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);

		this.setState({
			questions: questions,
			filteredQuestions: questions,
			totalPages,
			loading: false
		});
	;}

	private onEditClick = (question: Question) => {
		history.push(`/questions/${question.id}`);
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
	editCallback: (question: Question) => void,
	deleteCallback: (question: Question) => void,
}

// maybe this one can become an external component for all situations that require a list of items to be rendered
const RenderPageItems: React.FC<IRenderPageItemsProps> = ({items, editCallback, deleteCallback}) => {
	if (items.length === 0)
		return <NonIdealState title="No results" />;

	return (
		<>
			{items.map(question => (
				<tr key={question.id}>
					<td style={{ width: 40}}>{question.id}</td>

					<td>{question.prompt}</td>

					<td style={{ width: 40}}>{question.tagId}</td>

					<td style={{ width: 180}}>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<Button icon="edit" onClick={() => editCallback(question)}>
								Edit
							</Button>

							<Button icon="trash" onClick={() => deleteCallback(question)}>
								Delete
							</Button>
						</div>
					</td>
				</tr>
			))}
		</>
	);
};
