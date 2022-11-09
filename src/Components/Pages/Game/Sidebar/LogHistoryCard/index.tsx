import React, {useMemo, useState, useContext, useCallback} from 'react';
import {Button, Icon} from '@blueprintjs/core';
import {ObjectId} from '../../../../../Api/Point-Tracking';
import {NonIdealState} from '../../../../NonIdealState';
import {GameCard} from '../GameCard/GameCard';
import {formatDate} from '../../../../Utility/date';
import {IconSize} from '../../../../../IconSize';
import {UserContext} from '../../../../../Session';
import {HistoryItem, HistoryModel} from '../../../../../Api/Game-State/Models/History';
import * as toaster from '../../../../../Toaster';
import {Classes} from '../../../../../classes';
import './LogHistoryCard.scss';

interface IProps {
	logItems: HistoryItem[] | null;
}

type DateGroup = {
	[key: string]: HistoryItem[];
};

export const LogHistoryCard: React.FC<IProps> = ({logItems}) => {
	const [processing, setIsProcessing] = useState(false);
	const [currentItems, setCurrentItems] = useState(logItems);
	const User = useContext(UserContext);

	const groupedDates = useMemo(() => {
		if (!Array.isArray(currentItems))
			return {};

		else {
			return currentItems.reduce((dates: DateGroup, item) => {
				const {timestamp} = item;
				const formattedDate = formatDate(timestamp);

				dates[formattedDate] = dates[formattedDate] ?? [];
				dates[formattedDate].push(item);

				return dates;
			}, {});
		}
	}, [currentItems]);

	const currentDateFormatted = useMemo(() => formatDate(new Date()), []);

	const onLoadMoreClick = useCallback(async (lastItemId: ObjectId | undefined) => {
		setIsProcessing(true);

		await HistoryModel.getAfter(User!.account.id, lastItemId!)
			.then(({data}) => setCurrentItems(data))
			.catch(_ => {
				setCurrentItems(null);
				toaster.showUnhandledErrorMessage();
			});

		setIsProcessing(false);
	}, []);

	const onRefreshClick = useCallback(async () => {
		setIsProcessing(true);

		await HistoryModel.get(User!.account.id)
			.then(({data}) => setCurrentItems(data))
			.catch(_ => {
				setCurrentItems(null);
				toaster.showUnhandledErrorMessage();
			});

		setIsProcessing(false);
	}, []);

	return (
		<GameCard title="Log History" icon="history">
			{(Array.isArray(currentItems) && currentItems.length === 0) || currentItems === null ? (
				<NonIdealState
					hideIcon
					title={currentItems !== null ? "There isn't any history yet." : "An error ocurred while fetching history data."}
					action={
						<Button icon="refresh" text="Refresh history" onClick={onRefreshClick} loading={processing} />
					}
				/>
			) : (
				<>
					{Object.keys(groupedDates).map(date => {
						return (
							<ul key={date} className={Classes.LOG_HISTORY_CARD}>
								{currentDateFormatted !== date && <span className={Classes.ITEM_DATE}>{date}</span>}

								{groupedDates[date].map(logItem => (
									<LogItem key={logItem.id.$oid}>{logItem.content}</LogItem>
								))}
							</ul>
						);
					})}

					<div className={Classes.CARD_BUTTON_WRAPPER}>
						<Button onClick={() => onLoadMoreClick(currentItems.at(-1)?.id)} loading={processing}>
							Load More...
						</Button>
					</div>
				</>
			)}
		</GameCard>
	);
};

const LogItem: React.FC<{children: React.ReactNode}> = ({children}) => {
	return (
		<li>
			<Icon icon="direction-right" size={IconSize.SMALL} />

			<span className={Classes.ITEM_CONTENT}>{children}</span>
		</li>
	);
};
