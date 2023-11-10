import {Button, Checkbox, H2, HTMLTable, Intent} from '@blueprintjs/core';
import React from 'react';
import {User} from '../../../../Api/Hub/Models/Users';
import {PointItem, PointsModel} from '../../../../Api/Point-Tracking/Models/Points';
import {Classes} from '../../../../classes';
import {Spacing} from '../../../../Styles/variables';
import {toaster} from '../../../../toaster';
import {DeleteDialog} from '../../../DeleteDialog';
import {FrameLoadingSpinner} from '../../../FrameLoadingSpinner';
import {NonIdealState} from '../../../NonIdealState';
import {formatDate} from '../../../Utility/date';
import {allSettled, isRejectedResult} from '../../../Utility/promise';

interface Props {
	user: User,
}

export const PointsTab: React.FC<Props> = ({user}) => {
	const [points, setPoints] = React.useState<PointItem[] | null>(null);

	React.useEffect(() => {
		PointsModel.getFull(user.id).then(r => {
			setPoints(r.data.points);
		}).catch(() => {
			toaster.error('Could not load points.');
		});
	}, [user]);

	const onDelete = React.useCallback(() => {
		// TODO
	}, [user]);

	const onItemDelete = React.useCallback(async (target: PointItem) => {
		try {
			await PointsModel.delete(user.id, target.id);
		} catch (error) {
			toaster.showUnhandledErrorMessage();
			throw error;
		}

		setPoints(points => {
			if (points === null)
				return points;

			return points.filter(item => item !== target);
		});
	}, [user]);

	const onBulkDelete = React.useCallback(async (items: PointItem[]) => {
		const results = await allSettled(items.map(async item => {
			await PointsModel.delete(user.id, item.id);
			return item;
		}));

		const deletedItems: PointItem[] = [];

		for (const result of results) {
			if (isRejectedResult(result))
				continue;

			deletedItems.push(result.value);
		}

		if (deletedItems.length !== items.length)
			toaster.error('Some points could not be deleted. Please try again later.');

		setPoints(points => {
			if (points === null)
				return points;

			return points.filter(item => !deletedItems.includes(item));
		});

		return deletedItems;
	}, [user]);

	if (points === null)
		return <FrameLoadingSpinner />;

	return (
		<div>
			<PointsTable items={points} onItemDelete={onItemDelete} onBulkDelete={onBulkDelete} />
		</div>
	);
};

interface TableProps {
	items: PointItem[],
	onItemDelete: (item: PointItem) => Promise<void>,
	onBulkDelete: (items: PointItem[]) => Promise<PointItem[]>,
}

function PointsTable({items, onItemDelete: onItemDeleteBase, onBulkDelete}: TableProps): JSX.Element {
	const [selected, setSelected] = React.useState<PointItem[]>([]);
	const [showDialog, setShowDialog] = React.useState(false);

	const onItemSelectChange = React.useCallback((target: PointItem, selected: boolean) => {
		if (selected)
			setSelected(selected => [...selected, target]);
		else
			setSelected(selected => selected.filter(item => item !== target));
	}, []);

	const onItemDelete = React.useCallback(async (target: PointItem) => {
		try {
			await onItemDeleteBase(target);
		} catch {
			return;
		} finally {
			setShowDialog(false);
		}

		setSelected(selected => {
			if (!selected.includes(target))
				return selected;

			return selected.filter(item => item !== target);
		});
	}, [onItemDeleteBase]);

	const onSelectAllClick = React.useCallback(() => {
		if (items.length === selected.length)
			setSelected([]);
		else
			setSelected(items);
	}, [items, selected]);

	const onBulkDeleteClick = React.useCallback(() => setShowDialog(true), []);

	const onBulkDeleteConfirm = React.useCallback(async () => {
		if (selected.length === 0)
			return;

		const deleted = await onBulkDelete(selected);

		if (deleted.length === selected.length)
			toaster.success('Selected points deleted successfully.');

		setSelected([]);
		setShowDialog(false);
	}, [onBulkDelete, selected]);

	const onBulkDeleteCancel = React.useCallback(() => setShowDialog(false), []);

	if (items.length === 0) {
		return (
			<NonIdealState
				title="This user doesn't have any points assigned"
				description="You can start assigning points using the button below"
				action={(
					<Button
						icon="plus"
						text="Add Points"
						outlined={true}
						intent={Intent.PRIMARY}
					/>
				)}
			/>
		);
	}

	return (
		<>
			<div className={Classes.SETTINGS_TITLE_WRAPPER}>
				<H2>Points</H2>

				<Button
					text="Delete Selected"
					icon="delete"
					intent={Intent.DANGER}
					disabled={selected.length === 0}
					onClick={onBulkDeleteClick}
				/>
			</div>

			<HTMLTable striped={true}>
				<thead>
					<tr>
						<th style={{width: Spacing.XLarge}}>
							<Checkbox checked={items.length === selected.length} onClick={onSelectAllClick} />
						</th>

						<th>Source</th>
						<th>Point Value</th>
						<th>Timestamp</th>
						<th>Description</th>
						<th style={{width: 100, textAlign: 'center'}}>Delete</th>
					</tr>
				</thead>

				<tbody>
					{items.map(item => (
						<PointRow
							key={item.id.$oid}
							item={item}
							selected={selected.includes(item)}
							onSelectChange={onItemSelectChange}
							onDelete={onItemDelete}
						/>
					))}
				</tbody>
			</HTMLTable>

			<DeleteDialog
				isOpen={showDialog}
				onConfirm={onBulkDeleteConfirm}
				onCancel={onBulkDeleteCancel}
				multiple={true}
			/>
		</>
	);
}

interface RowProps {
	item: PointItem,
	selected: boolean,
	onSelectChange: (item: PointItem, selected: boolean) => void,
	onDelete: (item: PointItem) => void,
}

function PointRow({item, selected, onSelectChange, onDelete}: RowProps): JSX.Element {
	const onSelectCheckboxClick = React.useCallback(() => {
		onSelectChange(item, !selected);
	}, [item, selected, onSelectChange]);

	const onDeleteClick = React.useCallback(() => {
		onDelete(item);
	}, [onDelete, item]);

	return (
		<tr>
			<td>
				<Checkbox checked={selected} onClick={onSelectCheckboxClick} />
			</td>

			<td>{item.source}</td>
			<td>{item.point_value}</td>
			<td>{formatDate(item.timestamp)}</td>
			<td>{item.description ?? '—'}</td>

			<td style={{textAlign: 'center'}}>
				<Button
					icon="delete"
					minimal={true}
					intent={Intent.DANGER}
					onClick={onDeleteClick}
				/>
			</td>
		</tr>
	);
}
