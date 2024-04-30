import * as React from 'react';
import {Department, DepartmentModel} from '../../../Api/Hub/Models/Departments';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {toaster} from '../../../toaster';
import {ObjectList} from '../../ObjectList';
import {Button, Checkbox, HTMLTable, Intent} from '@blueprintjs/core';
import {LinkButton} from '../../LinkButton';
import {DeleteDialog, DeleteSubject} from '../../DeleteDialog';
import {allSettled, isRejectedResult} from '../../Utility/promise';
import {Spacing} from '../../../Styles/variables';

interface IState {
	departments: Department[];
	loading: boolean;
	deleteTargets: Department[];
	deleteSubject: string | undefined;
	selectedItems: Department[];
}

export class DepartmentsListPage extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: true,
		departments: [],
		deleteTargets: [],
		deleteSubject: undefined,
		selectedItems: [],
	};

	public async componentDidMount() {
		try {
			this.setState({
				departments: await DepartmentModel.list().then(response => response.data),
				loading: false,
			});
		} catch (error) {
			toaster.error('Failed to fetch departments');

			return;
		}
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<section className="gm-page-wrapper">
				<ObjectList
					title="Departments"
					editorUrlPrefix="/departments"
					items={this.state.departments}
					onItemFilter={this.onItemFilter}
					itemsPerPage={20}
					onBulkDeleteClick={this.onBulkDeleteClick}
					bulkDeleteDisabled={this.state.selectedItems.length === 0}
				>
					{items => (
						<HTMLTable striped={true}>
							<thead>
								<tr>
									<th style={{width: Spacing.XLarge}}>
										<Checkbox
											checked={this.isAllChecked()}
											onClick={this.onSelectAllClick}
										/>
									</th>

									<th>Name</th>
									<th>Members</th>
									<th style={{textAlign: 'center', width: 100}}>Edit</th>
									<th style={{textAlign: 'center', width: 100}}>Delete</th>
								</tr>
							</thead>

							<tbody>
								{items.map(item => (
									<TableItem
										key={item.id}
										item={item}
										onDelete={this.onDeleteClick}
										onSelect={this.onSelectClick}
										isChecked={this.isChecked(item)}
									/>
								))}
							</tbody>
						</HTMLTable>
					)}
				</ObjectList>

				<DeleteDialog
					isOpen={this.state.deleteTargets.length > 0}
					multiple={this.state.deleteTargets.length > 1}
					onConfirm={this.onDeleteConfirm}
					onCancel={this.onDeleteCancel}
					subject={this.state.deleteSubject}
				/>
			</section>
		);
	}

	private onItemFilter = (item: Department, searchText: string) => item.name.toLocaleLowerCase().includes(searchText);

	private isChecked = (item: Department) => this.state.selectedItems.includes(item);

	private isAllChecked = () => this.state.selectedItems.length === this.state.departments.length;

	private onSelectAllClick = () => {
		if (this.isAllChecked()) {
			this.setState({
				selectedItems: [],
			});
		} else {
			this.setState(state => ({
				selectedItems: [...state.departments],
			}));
		}
	};

	private onSelectClick = (item: Department) => {
		if (this.state.selectedItems.includes(item))
			this.setState(state => ({
				selectedItems: state.selectedItems.filter(selectedItem => selectedItem !== item),
			}));
		else
			this.setState(state => ({
				selectedItems: [...state.selectedItems, item],
			}));
	};

	private onDeleteClick = (target: Department) => this.setState({
		deleteTargets: [target],
		deleteSubject: DeleteSubject.DELETE,
	});

	private onBulkDeleteClick = () => this.setState(state => ({
		deleteTargets: state.selectedItems,
		deleteSubject: DeleteSubject.DELETE,
	}));

	private onDeleteConfirm = async () => {
		if (this.state.deleteTargets.length === 0)
			return;

		const results = await allSettled(
			this.state.deleteTargets.map(async item => {
				await DepartmentModel.delete(item.id);

				return item;
			})
		);

		let failureCount = 0;
		const deletedItems: Department[] = [];

		for (const result of results) {
			if (isRejectedResult(result)) {
				failureCount++;
				continue;
			}

			deletedItems.push(result.value);
		}

		if (failureCount > 0)
			toaster.showUnhandledErrorMessage();

		toaster.success(`Department${this.state.selectedItems.length > 1 ? 's' : ''} deleted successfully`);

		this.setState(state => ({
			departments: state.departments.filter(item => !deletedItems.includes(item)),
			selectedItems: state.selectedItems.filter(item => !deletedItems.includes(item)),
			deleteTargets: [],
		}));
	};

	private onDeleteCancel = () => this.setState({
		deleteTargets: [],
		deleteSubject: undefined,
	});
}

interface TableItemProps {
	item: Department;
	onDelete: (item: Department) => void;
	onSelect: (item: Department) => void;
	isChecked: boolean;
}

const TableItem: React.FC<TableItemProps> = ({item, onDelete, onSelect, isChecked}) => {
	const onDeleteButtonClick = React.useCallback(() => {
		onDelete(item);
	}, [item, onDelete]);

	const onSelectButtonClick = React.useCallback(() => {
		onSelect(item);
	}, [item, onSelect]);

	return (
		<tr>
			<td>
				<Checkbox checked={isChecked} onClick={onSelectButtonClick} />
			</td>

			<td>{item.name}</td>
			<td>{item.members.length} Member{item.members.length !== 1 ? 's' : ''}</td>

			<td style={{textAlign: 'center'}}>
				<LinkButton to={`/departments/${item.id}`} icon="edit" minimal={true} />
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
