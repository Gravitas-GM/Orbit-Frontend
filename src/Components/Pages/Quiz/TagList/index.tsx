import React from "react";
import { PageHeader } from "../../../PageHeader";
import { Button, HTMLTable, InputGroup } from "@blueprintjs/core";
import { Spacing } from "../../../../Styles/variables";
import { NonIdealState } from "../../../NonIdealState";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { history } from "../../../../history";

// temporary dummy data and interfaces

export interface User {
	id: number;
	name: string;
	nextQuizTimestamp: Date;
	assignedTags: QuestionTag[];
}

export interface QuestionTag {
	id: number;
	label: string;
	members: User[];
}

const tags: QuestionTag[] = [];

const curentTags: QuestionTag[] = [
	{
		id: 1,
		label: "General",
		members: [
			{
				assignedTags: tags,
				id: 1,
				name: "John Doe",
				nextQuizTimestamp: new Date(),
			},
			{
				assignedTags: tags,
				id: 2,
				name: "Jane Datsun",
				nextQuizTimestamp: new Date()
			},
			{
				assignedTags: tags,
				id: 3,
				name: "Rupert Holmes",
				nextQuizTimestamp: new Date()
			}
		],
	},
	{
		id: 2,
		label: "Design",
		members: [
			{
				assignedTags: tags,
				id: 1,
				name: "John Doe",
				nextQuizTimestamp: new Date(),
			},
		],
	},
];

// end temporary dummy data and interfaces

interface ITagListState {
	tags: QuestionTag[];
	loading: boolean;
	filteredTags: QuestionTag[];
	currentPage: number;
	totalPages: number;
}

const ITEMS_PER_PAGE = 10;

export class TagListPage extends React.PureComponent<{}, ITagListState> {
	public state: Readonly<ITagListState> = {
		loading: false,
		tags: [],
		filteredTags: [],
		currentPage: 1,
		totalPages: 1,
	};

	public async componentDidMount() {
		// temporary fetch questions
		await this.fetchTags();
	};

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		const { currentPage, totalPages } = this.state;
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		const currrentPageItems = this.state.filteredTags.slice(startIndex, endIndex);

		return (
			<section className="gm-page-wrapper">
				<PageHeader title="Categories">
					<div style={{ display: "flex", flexDirection: "column", gap: Spacing.l }}>
						<InputGroup type="search" leftIcon="search" placeholder="Search categories" onChange={this.onSearchChange} />
						<Button icon="add">Add New</Button>
					</div>
				</PageHeader>

				<RenderTableItems
					items={currrentPageItems}
					editCallback={this.onEditClick}
					deleteCallback={this.onDeleteClick}
				/>

				{curentTags.length > ITEMS_PER_PAGE && (
					<div className="pagination-container">
						<Button disabled={this.state.currentPage === 1} onClick={this.onClickBack} icon="caret-left">
							Prev
						</Button>

						<span>
							{currentPage}/{totalPages}
						</span>

						<Button disabled={this.state.currentPage >= totalPages} onClick={this.onClickNext} rightIcon="caret-right">
							Next
						</Button>
					</div>
				)}
			</section>
		);
	};

	private fetchTags = async () => {
		this.setState({ loading: true });

		let totalPages = Math.ceil(tags.length / ITEMS_PER_PAGE);
		totalPages = totalPages === 0 ? 1 : totalPages;

		this.setState({
			tags: curentTags,
			filteredTags: curentTags,
			totalPages,
			loading: false,
		});
	};

	private onEditClick = (tag: QuestionTag) => {
		history.push(`/quiz/tags/${tag.id}`);
	};

	private onDeleteClick = (tag: QuestionTag) => {
		return;
	};

	private onClickNext = () => {
		if (this.state.currentPage === this.state.totalPages) return;

		this.setState((state) => ({
			currentPage: state.currentPage + 1,
		}));
	};

	private onClickBack = () => {
		if (this.state.currentPage === 1) return;

		this.setState((state) => ({
			currentPage: state.currentPage - 1,
		}));
	};

	private onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.currentTarget.value === "") {
			const totalPages = Math.ceil(this.state.tags.length / ITEMS_PER_PAGE);

			this.setState({
				filteredTags: this.state.tags,
				currentPage: 1,
				totalPages,
			});

			return;
		}

		const filteredTags = this.state.tags.filter((tag) =>
			tag.label.toLocaleLowerCase().includes(event.currentTarget.value.toLocaleLowerCase())
		);

		const totalPages = Math.ceil(filteredTags.length / ITEMS_PER_PAGE);

		this.setState({
			filteredTags,
			currentPage: 1,
			totalPages,
		});
	};
}

interface IRenderTableItemsProps {
	items: QuestionTag[];
	editCallback: (tag: QuestionTag) => void;
	deleteCallback: (tag: QuestionTag) => void;
}

// maybe this one can become an external component for all situations that require a list of items to be rendered
const RenderTableItems: React.FC<IRenderTableItemsProps> = ({ items, editCallback, deleteCallback }) => {
	if (items.length === 0) {
		return (
			<div style={{ textAlign: 'center'}}>
				<NonIdealState title="No categories found." />
			</div>
		);
	}

	return (
		<div className="question-list">
			<HTMLTable striped={true}>
				<thead>
					<tr>
						<th>Label</th>
						<th>Members</th>
						<th>Actions</th>
					</tr>
				</thead>

				<tbody>
					{items.map((tag) => (
						<tr key={tag.id}>
							<td>{tag.label}</td>

							<td style={{ width: 120 }}>
								{tag.members.length}
							</td>

							<td style={{ width: 80 }}>
								<div style={{ display: "flex", justifyContent: "space-between" }}>
									<Button icon="edit" minimal={true} onClick={() => editCallback(tag)}/>

									<Button icon="trash" minimal={true} onClick={() => deleteCallback(tag)}/>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</HTMLTable>
		</div>
	);
};
