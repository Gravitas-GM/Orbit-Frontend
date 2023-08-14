import React from "react";
import { PageHeader } from "../../../PageHeader";
import { Button, InputGroup } from "@blueprintjs/core";
import { Spacing } from "../../../../Styles/variables";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { TagEditorDialog } from "./TagEditorDialog";
import { QuestionTagModel, QuestionTag, QuestionTagCreatePayload } from "../../../../Api/Quiz/Models/QuestionTags";
import * as toaster from "../../../../Toaster";
import { history } from "../../../../history";
import { RenderTableItems } from "./RenderTableItems";
import { DeleteDialog } from "../../../DeleteDialog";
import { User, UserModel } from "../../../../Api/Hub/Models/Users";
import { ValidationFailures, isValidationFailureError } from "../../../../Api/errors/symfony";

interface IState {
	tags: QuestionTag[];
	tagToDelete: QuestionTag | null;
	tagToEdit: QuestionTag | null;
	loading: boolean;
	processing: boolean;
	filteredTags: QuestionTag[];
	currentPage: number;
	totalPages: number;
	showEditDialog: boolean;
	showDeleteDialog: boolean;
	users: User[];
	validationFailures: ValidationFailures | null;
}

const ITEMS_PER_PAGE = 10;

export class TagListPage extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: false,
		processing: false,
		tags: [],
		tagToEdit: null,
		tagToDelete: null,
		filteredTags: [],
		currentPage: 1,
		totalPages: 1,
		showDeleteDialog: false,
		showEditDialog: false,
		users: [],
		validationFailures: null,
	};

	public async componentDidMount() {
		await this.fetchData();
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
				<PageHeader title="Tags">
					<div style={{ display: "flex", flexDirection: "column", gap: Spacing.Large }}>
						<InputGroup type="search" leftIcon="search" placeholder="Search tags" onChange={this.onSearchChange} />

						<Button
							icon="add"
							onClick={this.toggleEditTagDialog}
						>
							Add New
						</Button>
					</div>
				</PageHeader>

				<RenderTableItems
					items={currrentPageItems}
					editCallback={this.onEditClick}
					deleteCallback={this.onDeleteClick}
				/>

				{this.state.tags.length > ITEMS_PER_PAGE && (
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

			<TagEditorDialog
				isOpen={this.state.showEditDialog}
				onClose={this.toggleEditTagDialog}
				tag={this.state.tagToEdit}
				users={this.state.users}
				onSubmit={this.onSubmit}
				validationFailures={this.state.validationFailures}
			/>

			<DeleteDialog
				isOpen={this.state.showDeleteDialog}
				onCancel={this.toggleDeleteTagDialog}
				onConfirm={this.onConfirmDelete}
				subject={this.state.tagToDelete?.label}
			/>
			</section>
		);
	};

	private fetchData = async () => {
		this.setState({
			loading: true
		});

		let totalPages = 0;
		let tags: QuestionTag[] = [];

		try {
			tags = await QuestionTagModel.list().then((res) => res.data);

			totalPages = Math.ceil(tags.length / ITEMS_PER_PAGE);

			totalPages = totalPages === 0 ? 1 : totalPages;
		} catch (err) {
			toaster.error("Failed to fetch question tags");

			this.setState({
				loading: false,
			});

			history.push("/");
		}

		let users: User[] = [];

		try {
			users = await UserModel.list().then((res) => res.data);
		} catch (err) {
			toaster.error("Failed to fetch users");

			this.setState({
				loading: false,
			});

			history.push("/");
		}

		this.setState({
			tags,
			filteredTags: tags,
			totalPages,
			loading: false,
			users,
		});
	};

	private toggleDeleteTagDialog = () => {
		this.setState((state) => ({
			tagToDelete: null,
			showDeleteDialog: !state.showDeleteDialog
		}));
	};

	private toggleEditTagDialog = () => {
		this.setState((state) => ({
			tagToEdit: null,
			showEditDialog: !state.showEditDialog
		}));
	};

	private onEditClick = (tag: QuestionTag) => {
		this.setState({
			tagToEdit: tag,
			showEditDialog: true
		});
	};

	private onDeleteClick = (tag: QuestionTag) => {
		this.setState({
			tagToDelete: tag,
			showDeleteDialog: true
		});
	};

	private onConfirmDelete = async () => {

		try {
			await QuestionTagModel.delete(this.state.tagToDelete!.id);

			toaster.success("Tag deleted successfully");

			// should we refetch the tags or just remove it from the list?
			await this.fetchData();
		} catch (err) {
			this.setState({
				showDeleteDialog: false
			});

			toaster.error("Failed to delete tag");

			return;
		}

		this.setState({
			tagToDelete: null,
			showDeleteDialog: false
		});
	}

	private onClickNext = () => {
		if (this.state.currentPage === this.state.totalPages)
			return;

		this.setState((state) => ({
			currentPage: state.currentPage + 1,
		}));
	};

	private onClickBack = () => {
		if (this.state.currentPage === 1)
			return;

		this.setState((state) => ({
			currentPage: state.currentPage - 1,
		}));
	};

	private onSubmit = async (tag: QuestionTagCreatePayload) => {
		this.setState({
			processing: true
		})

		try {
			await QuestionTagModel.create(tag).then((response) => response.data);
		} catch (err) {
			if (isValidationFailureError(err)) {
				toaster.error("One or more fields did not pass validation");

				this.setState({
					validationFailures: err.context.failures,
					processing: false,
				});
			} else {
				toaster.showUnhandledErrorMessage();
			}

			return;
		}

		this.setState({
			processing: false
		});
	}

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

