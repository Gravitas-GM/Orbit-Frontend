import * as React from 'react';
import { PageHeader } from "../../../PageHeader";
import { AnchorButton, Button, InputGroup } from "@blueprintjs/core";
import { Spacing } from "../../../../Styles/variables";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { history } from "../../../../history";
import { Question, QuestionModel } from "../../../../Api/Quiz/Models/Questions";
import * as toaster from "../../../../Toaster";
import { RenderPageItems } from "./RenderPageItems";

interface IState {
	questions: Question[],
	loading: boolean,
	filteredQuestions: Question[],
	currentPage: number,
	totalPages: number,
 };

const ITEMS_PER_PAGE = 10;

export class QuestionListPage extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: false,
		questions: [],
		filteredQuestions: [],
		currentPage: 1,
		totalPages: 1,
	};

	public async componentDidMount() {
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
					<div style={{ display: "flex", flexDirection: "column", gap: Spacing.Large}}>
						<InputGroup
							type="search"
							leftIcon="search"
							placeholder="Search questions"
							onChange={this.onSearchChange}
						/>
						<AnchorButton icon="add" href="/quiz/questions/new">Add New</AnchorButton>
					</div>
				</PageHeader>

				<RenderPageItems
					items={currrentPageItems}
					deleteCallback={this.onDeleteClick}
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
		this.setState({
			loading: true
		});

		let questions: Question[] = [];

		try {
			questions = await QuestionModel.list().then(response => response.data);
		} catch (error) {
			toaster.error("Failed to fetch questions");

			this.setState({ loading: false });

			history.push("/");

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

	private onDeleteClick = async (question: Question) => {
		this.setState({
			loading: true
		});

		try {
			await QuestionModel.delete(question.id);
		} catch (error) {
			toaster.error("Failed to delete question");
		}

		toaster.success("Question deleted successfully");

		await this.fetchQuestions();
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
		if (event.currentTarget.value === "") {
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
