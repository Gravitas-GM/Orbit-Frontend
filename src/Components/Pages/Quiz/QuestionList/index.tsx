import React from "react";
import { PageHeader } from "../../../PageHeader";
import { Button, HTMLTable, InputGroup } from "@blueprintjs/core";
import { Spacing } from "../../../../Styles/variables";
import { NonIdealState } from "../../../NonIdealState";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { history } from "../../../../history";

// temporary dummy data and interfaces

interface BaseQuestion {
    id: number,
    tag: { id: number, name: string },
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

const questions: Question[] = [
	{
		id: 1,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of the United States?',
		kind: QuestionKind.FreeText,
		answers: ['Washington, D.C.'],
	},
	{
		id: 2,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of Canada?',
		kind: QuestionKind.FreeText,
		answers: ['Ottawa'],
	},
	{
		id: 3,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of Mexico?',
		kind: QuestionKind.FreeText,
		answers: ['Mexico City'],
	},
	{
		id: 4,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of Brazil?',
		kind: QuestionKind.FreeText,
		answers: ['Brasilia'],
	},
	{
		id: 5,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of Argentina?',
		kind: QuestionKind.FreeText,
		answers: ['Buenos Aires'],
	},
	{
		id: 6,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of Chile?',
		kind: QuestionKind.FreeText,
		answers: ['Santiago'],
	},
	{
		id: 7,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of Peru?',
		kind: QuestionKind.FreeText,
		answers: ['Lima'],
	},
	{
		id: 8,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of Colombia?',
		kind: QuestionKind.FreeText,
		answers: ['Bogota'],
	},
	{
		id: 9,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of Venezuela?',
		kind: QuestionKind.FreeText,
		answers: ['Caracas'],
	},
	{
		id: 10,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of Ecuador?',
		kind: QuestionKind.FreeText,
		answers: ['Quito'],
	},
	{
		id: 11,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of Bolivia?',
		kind: QuestionKind.FreeText,
		answers: ['La Paz'],
	},
	{
		id: 12,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of Paraguay?',
		kind: QuestionKind.FreeText,
		answers: ['Asuncion'],
	},
	{
		id: 13,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of Uruguay?',
		kind: QuestionKind.FreeText,
		answers: ['Montevideo'],
	},
	{
		id: 14,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of Guyana?',
		kind: QuestionKind.FreeText,
		answers: ['Georgetown'],
	},
	{
		id: 15,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of Suriname?',
		kind: QuestionKind.FreeText,
		answers: ['Paramaribo'],
	},
	{
		id: 16,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of French Guiana?',
		kind: QuestionKind.FreeText,
		answers: ['Cayenne'],
	},
	{
		id: 17,
		tag: {
			id: 1,
			name: 'General'
		},
		prompt: 'What is the capital of Cuba?',
		kind: QuestionKind.FreeText,
		answers: ['Havana'],
	},
	{
		id: 18,
		tag: {
			id: 1,
			name: 'General'
		},
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
						<Button icon="add">Add New</Button>
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
								<Button icon="edit" minimal={true} onClick={() => editCallback(question)} />

								<Button icon="trash" minimal={true} onClick={() => deleteCallback(question)} />
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</HTMLTable>
	);
};
