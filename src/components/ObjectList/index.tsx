import {Button, InputGroup} from '@blueprintjs/core';
import * as React from 'react';
import {Classes} from '../../classes';
import {useWatchedQuery} from '../../hooks/useWatchedQuery';
import {LinkButton} from '../LinkButton';
import {NonIdealState} from '../NonIdealState';
import {PageHeader} from '../PageHeader';
import {Pagination} from '../Pagination';
import './index.scss';

interface Props<T> {
	title?: string;
	items: T[];
	onItemFilter?: (a: T, searchText: string) => boolean;
	children: (items: T[]) => React.ReactNode;
	editorUrlPrefix?: string;
	searchPlaceholder?: string;
	onAddNewClick?: () => void;
	onBulkDeleteClick?: () => void;
	bulkDeleteDisabled?: boolean;
	itemsPerPage?: number;
	controls?: React.ReactNode;
}

const DEFAULT_ITEMS_PER_PAGE = 20;

const URL_PARAM_SEARCH = 'search';
const URL_PARAM_PAGE = 'page';

// Bugs:
//    - Total pages does not update if props.items changes
//    - currentPage needs to check if the page is still valid after props.items updates
export function ObjectList<T>(props: Props<T>): React.ReactElement {
	const [filteredItems, setFilteredItems] = React.useState<T[] | null>(null);

	const query = useWatchedQuery();

	const [currentPage, setCurrentPage] = React.useState(() => {
		const value = query.get(URL_PARAM_PAGE);

		if (value === null)
			return 1;

		const parsed = parseInt(value, 10);
		return isNaN(parsed) ? 1 : parsed;
	});

	const itemsPerPage = props.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE;

	const [totalPages, setTotalPages] = React.useState(() => Math.ceil(props.items.length / itemsPerPage));

	// Keep `totalPages` in sync with the value derived from the `itemsPerPage` prop
	React.useEffect(() => {
		setTotalPages(Math.ceil(props.items.length / itemsPerPage));
		setCurrentPage(1);
		query.delete(URL_PARAM_PAGE);
	}, [itemsPerPage]);

	const [searchText, setSearchText] = React.useState(() => query.get(URL_PARAM_SEARCH) ?? '');

	const onPageBack = React.useCallback(() => setCurrentPage(page => {
		const newPage = Math.max(1, page - 1);

		if (newPage === page)
			return page;

		if (newPage > 1)
			query.set(URL_PARAM_PAGE, newPage.toString(10));
		else
			query.delete(URL_PARAM_PAGE);

		return newPage;
	}), [query]);

	const onPageNext = React.useCallback(() => setCurrentPage(page => {
		const newPage = Math.min(totalPages, page + 1);

		if (newPage === page)
			return page;

		query.set(URL_PARAM_PAGE, newPage.toString(10));

		return newPage;
	}), [totalPages, query]);

	const applySearch = React.useCallback((searchText: string) => {
		let items: T[] = props.items;
		const {onItemFilter} = props;

		if (onItemFilter && searchText.length > 0) {
			items = items.filter(item => onItemFilter(item, searchText));

			setFilteredItems(items);
			query.set(URL_PARAM_SEARCH, searchText);
		} else {
			setFilteredItems(null);
			query.delete(URL_PARAM_SEARCH);
		}

		const totalPages = Math.max(Math.ceil(items.length / itemsPerPage), 1);
		setTotalPages(totalPages);

		// Handles the case where the user is on the final page of the list, and deletes the final item on that page.
		const newCurrentPage = Math.min(currentPage, totalPages);
		setCurrentPage(newCurrentPage);

		if (newCurrentPage > 1)
			query.set(URL_PARAM_PAGE, newCurrentPage.toString(10));
		else
			query.delete(URL_PARAM_PAGE);
	}, [props.items, props.onItemFilter, itemsPerPage, query, currentPage]);

	const onSearchChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const searchText = event.currentTarget.value.toLocaleLowerCase();
		setSearchText(searchText);

		applySearch(searchText);
	}, [applySearch]);

	const onSearchClearClick = React.useCallback(() => {
		setSearchText('');
		applySearch('');
	}, [applySearch]);

	// Re-apply our search function any time `props.items` changes. As a side effect, `applySearch()` should also
	// recalculate total pages and current page.
	React.useEffect(() => {
		applySearch(searchText);
	}, [props.items]);

	const startIndex = (currentPage - 1) * itemsPerPage;
	let items: T[] = (filteredItems ?? props.items).slice(startIndex, startIndex + itemsPerPage);

	let newButton: React.ReactNode = null;

	if (props.editorUrlPrefix)
		newButton = <LinkButton to={`${props.editorUrlPrefix}/new`} icon="plus" text="Add New" intent="primary" />;
	else if (props.onAddNewClick)
		newButton = <Button icon="plus" text="Add New" intent="primary" onClick={props.onAddNewClick} />;

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
			<PageHeader title={props.title} setPageTitle={false}>
				<div className="header-controls">
					{props.controls ??
						(
							props.onItemFilter && (
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
							)
						)}

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
