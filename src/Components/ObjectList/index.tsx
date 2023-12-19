import * as React from 'react';
import {Classes} from '../../classes';
import {PageHeader} from '../PageHeader';
import {Button, InputGroup} from '@blueprintjs/core';
import './index.scss';
import {LinkButton} from '../LinkButton';
import {Pagination} from '../Pagination';
import {NonIdealState} from '../NonIdealState';

interface Props<T> {
	title: string;
	items: T[];
	onItemFilter: (a: T, searchText: string) => boolean;
	children: (items: T[]) => React.ReactNode;
	editorUrlPrefix?: string;
	searchPlaceholder?: string;
	onAddNewClick?: () => void;
	onBulkDeleteClick?: () => void;
	bulkDeleteDisabled?: boolean;
	itemsPerPage?: number;
}

const DEFAULT_ITEMS_PER_PAGE = 20;

// Bugs:
//    - Total pages does not update if props.items changes
//    - currentPage needs to check if the page is still valid after props.items updates
export function ObjectList<T>(props: Props<T>): React.ReactElement {
	const [filteredItems, setFilteredItems] = React.useState<T[] | null>(null);
	const [currentPage, setCurrentPage] = React.useState(1);

	const itemsPerPage = props.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE;

	const [totalPages, setTotalPages] = React.useState(() => Math.ceil(props.items.length / itemsPerPage));

	// Keep `totalPages` in sync with the value derived from the `itemsPerPage` prop
	React.useEffect(() => {
		setTotalPages(Math.ceil(props.items.length / itemsPerPage));
		setCurrentPage(1);
	}, [itemsPerPage]);

	const [searchText, setSearchText] = React.useState('');

	const onPageBack = React.useCallback(() => setCurrentPage(page => Math.max(1, page - 1)), []);
	const onPageNext = React.useCallback(() => setCurrentPage(page => Math.min(totalPages, page + 1)), []);

	const applySearch = React.useCallback((searchText: string) => {
		let items: T[] = props.items;

		if (searchText.length > 0) {
			items = items.filter(item => props.onItemFilter(item, searchText));
			setFilteredItems(items);
		} else
			setFilteredItems(null);

		const totalPages = Math.ceil(items.length / itemsPerPage);
		setTotalPages(totalPages);

		// Handles the case where the user is on the final page of the list, and deletes the final item on that page.
		setCurrentPage(Math.min(currentPage, totalPages));
	}, [props.items, props.onItemFilter, itemsPerPage]);

	const onSearchChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const searchText = event.currentTarget.value.toLocaleLowerCase();
		setSearchText(searchText);

		applySearch(searchText);
	}, [applySearch]);

	const onSearchClearClick = React.useCallback(() => {
		setSearchText('');
		applySearch('');
	}, []);

	// Re-apply our search function any time `props.items` changes. As a side effect, `applySearch()` should also
	// recalculate total pages and current page.
	React.useEffect(() => {
		applySearch(searchText);
	}, [props.items]);

	const startIndex = (currentPage - 1) * itemsPerPage;

	let items: T[];

	if (props.items.length === 1)
		items = filteredItems ?? props.items;
	else
		items = (filteredItems ?? props.items).slice(startIndex, startIndex + itemsPerPage);

	let newButton: React.ReactNode = null;

	if (props.editorUrlPrefix)
		newButton = <LinkButton to={`${props.editorUrlPrefix}/new`} icon="plus" text="Add New" intent="primary" />;
	else if (props.onAddNewClick) {
		newButton = <Button icon="plus" text="Add New" intent="primary" onClick={props.onAddNewClick} />;
	}

	let deleteButton: React.ReactNode = null;

	if (props.onBulkDeleteClick) {
		deleteButton = (
			<Button
				text="Delete Selected"
				icon="delete"
				intent="danger"
				onClick={props.onBulkDeleteClick}
				disabled={props.bulkDeleteDisabled}
			/>
		);
	}

	return (
		<section id="object-list" className={Classes.PAGE_WRAPPER}>
			<PageHeader title={props.title}>
				<div className="header-controls">
					<InputGroup
						type="search"
						leftIcon="search"
						rightElement={(
							<Button
								icon="cross"
								minimal={true}
								small={true}
								style={{borderRadius: 30}}
								onClick={onSearchClearClick}
							/>
						)}
						placeholder={props.searchPlaceholder ?? 'Search'}
						onChange={onSearchChange}
						value={searchText}
					/>

					<div className="header-buttons">
						{deleteButton}

						{newButton}
					</div>
				</div>
			</PageHeader>

			{items.length > 0 ? props.children(items) : (
				<NonIdealState title={filteredItems !== null ? 'No items match your search.' : 'No items found.'} />
			)}

			<Pagination page={currentPage} totalPages={totalPages} onNext={onPageNext} onBack={onPageBack} />
		</section>
	);
}
