import * as React from 'react';
import {Classes} from '../../classes';
import {PageHeader} from '../PageHeader';
import {InputGroup} from '@blueprintjs/core';
import './index.scss';
import {LinkButton} from '../LinkButton';
import {Pagination} from '../Pagination';
import {NonIdealState} from '../NonIdealState';

interface Props<T> {
	title: string;
	editorUrlPrefix: string;
	items: T[];
	onItemFilter: (a: T, searchText: string) => boolean;
	onItemDelete: (target: T) => void;
	children: (items: T[]) => React.ReactNode;
	searchPlaceholder?: string;
	itemsPerPage?: number;
}

const DEFAULT_ITEMS_PER_PAGE = 20;

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

	const onPageBack = React.useCallback(() => setCurrentPage(page => Math.max(1, page - 1)), []);
	const onPageNext = React.useCallback(() => setCurrentPage(page => Math.min(totalPages, page + 1)), []);

	const onSearchChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const searchText = event.currentTarget.value.toLocaleLowerCase();
		let items: T[] = props.items;

		if (searchText.length > 0) {
			items = items.filter(item => props.onItemFilter(item, searchText));
			setFilteredItems(items);
		} else
			setFilteredItems(null);

		setTotalPages(Math.ceil(items.length / itemsPerPage));
		setCurrentPage(1);
	}, [props.items, props.onItemFilter, itemsPerPage]);

	const items = filteredItems ?? props.items;

	return (
		<section id="object-list" className={Classes.PAGE_WRAPPER}>
			<PageHeader title={props.title}>
				<div className="header-controls">
					<InputGroup
						type="search"
						leftIcon="search"
						placeholder={props.searchPlaceholder ?? 'Search'}
						onChange={onSearchChange}
					/>

					<LinkButton to={`${props.editorUrlPrefix}/new`} icon="add" text="Add New" fill={true} />
				</div>
			</PageHeader>

			{items.length > 0 ? props.children(items) : (
				<NonIdealState title={filteredItems !== null ? 'No items match your search.' : 'No items found.'} />
			)}

			<Pagination page={currentPage} totalPages={totalPages} onNext={onPageNext} onBack={onPageBack} />
		</section>
	);
}
