import * as React from 'react';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {history} from '../../../../history';
import {Question, QuestionModel} from '../../../../Api/Quiz/Models/Questions';
import {toaster} from '../../../../toaster';
import {ObjectList} from '../../../ObjectList';
import {Blockquote, Button, HTMLTable, Intent} from '@blueprintjs/core';
import {LinkButton} from '../../../LinkButton';
import {DeleteDialog} from '../../../DeleteDialog';

interface IState {
	questions: Question[];
	loading: boolean;
	deleteTarget: Question | null;
}

export class QuestionListPage extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: true,
		questions: [],
		deleteTarget: null,
	};

	public async componentDidMount() {
		try {
			this.setState({
				questions: await QuestionModel.list({
					_default: true,
					'tag.label': true,
				}).then(response => response.data),
				loading: false,
			});
		} catch (error) {
			toaster.error('Failed to fetch questions');
			history.push('/');

			return;
		}
	};

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<>
				<ObjectList
					title="Questions"
					editorUrlPrefix="/quiz/questions"
					items={this.state.questions}
					onItemFilter={this.onItemFilter}
					onAddNewClick={this.onAddNewClick}
					itemsPerPage={20}
				>
					{items => (
						<HTMLTable striped={true}>
							<thead>
								<tr>
									<th>Prompt</th>
									<th>Kind</th>
									<th>Tag</th>
									<th style={{textAlign: 'center', width: 100}}>Edit</th>
									<th style={{width: 100, textAlign: 'center'}}>Delete</th>
								</tr>
							</thead>

							<tbody>
								{items.map(item => (
									<TableItem
										key={item.id}
										item={item}
										onDelete={this.onItemDelete}
									/>
								))}
							</tbody>
						</HTMLTable>
					)}
				</ObjectList>

				<DeleteDialog
					isOpen={this.state.deleteTarget !== null}
					subject="DELETE"
					onConfirm={this.onDeleteConfirm}
					onCancel={this.onDeleteCancel}
				>
					<p>You are about to delete a question with the following prompt:</p>

					<Blockquote>
						{this.state.deleteTarget?.prompt}
					</Blockquote>

					<p>
						This action cannot be undone. To confirm, please type "DELETE" in the box below, then click
						"Confirm".
					</p>
				</DeleteDialog>
			</>
		);
	};

	private onAddNewClick = () => history.push('/quiz/questions/new');

	private onItemFilter = (item: Question, searchText: string) => item.prompt.toLocaleLowerCase().includes(searchText);

	private onItemDelete = (target: Question) => this.setState({
		deleteTarget: target,
	});

	private onDeleteConfirm = async () => {
		if (!this.state.deleteTarget)
			return;

		try {
			await QuestionModel.delete(this.state.deleteTarget.id);
		} catch (error) {
			toaster.error('Failed to delete question');

			return;
		}

		toaster.success('Question deleted successfully');

		this.setState(state => ({
			questions: state.questions.filter(item => item.id !== this.state.deleteTarget?.id),
			deleteTarget: null,
		}));
	};

	private onDeleteCancel = () => this.setState({
		deleteTarget: null,
	});
}

interface TableItemProps {
	item: Question;
	onDelete: (item: Question) => void;
}

const TableItem: React.FC<TableItemProps> = ({item, onDelete}) => {
	const onDeleteButtonClick = React.useCallback(() => {
		onDelete(item);
	}, [item, onDelete]);

	return (
		<tr>
			<td>{item.prompt}</td>

			<td>{item.kind}</td>

			<td>{item.tag?.label ?? '—'}</td>

			<td style={{textAlign: 'center'}}>
				<LinkButton to={`/quiz/questions/${item.id}`} icon="edit" minimal={true} />
			</td>

			<td style={{textAlign: 'center'}}>
				<Button
					icon="delete"
					intent={Intent.DANGER}
					onClick={onDeleteButtonClick}
					minimal={true}
				/>
			</td>
		</tr>
	);
};
