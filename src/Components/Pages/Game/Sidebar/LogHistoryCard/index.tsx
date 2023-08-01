import React, {useMemo} from 'react';
import {Button, Icon} from '@blueprintjs/core';
import SimpleBar from 'simplebar-react';
import {NonIdealState} from '../../../../NonIdealState';
import {GameCard} from '../GameCard/GameCard';
import {formatDate} from '../../../../Utility/date';
import {IconSize} from '../../../../../IconSize';
import {HistoryItem} from '../../../../../Api/Game-State/Models/History';
import './LogHistoryCard.scss';

interface IProps {
	history: HistoryItem[] | null;
	processing: boolean;
	onLoadClick: () => void;
}

type DateGroup = {
	[key: string]: HistoryItem[];
};

export const LogHistoryCard: React.FC<IProps> = ({history, processing, onLoadClick}) => {
	if (history === null || history.length === 0) {
		return (
			<GameCard title="Log" icon="history">
				<NonIdealState
					icon={null}
					title={(
						history !== null ? 'There isn\'t any history yet.' : 'There was an error getting history data.'
					)}
					action={(
						<Button icon="refresh" text="Refresh history" onClick={onLoadClick} loading={processing} />
					)}
				/>
			</GameCard>
		);
	}

	const groupedDates = useMemo(() => {
		if (history === null)
			return {};

		else {
			return history.reduce((dates: DateGroup, item) => {
				const {timestamp} = item;
				const formattedDate = formatDate(timestamp);

				dates[formattedDate] = dates[formattedDate] ?? [];
				dates[formattedDate].push(item);

				return dates;
			}, {});
		}
	}, [history]);

	const currentDateFormatted = formatDate(new Date());

	return (
		<GameCard title="Log" icon="history">
			<SimpleBar className="card-content-wrapper gm-log-history-card">
				{Object.keys(groupedDates).map(date => {
					return (
						<ul key={date}>
							{currentDateFormatted !== date && <span className="item-date">{date}</span>}

							{groupedDates[date].map(logItem => (
								<LogItem key={logItem.id.$oid}>{logItem.content}</LogItem>
							))}
						</ul>
					);
				})}

				<div className="button-wrapper">
					<Button onClick={onLoadClick} loading={processing}>
						Load More...
					</Button>
				</div>
			</SimpleBar>
		</GameCard>
	);
};

const LogItem: React.FC<{ children: React.ReactNode }> = ({children}) => {
	return (
		<li>
			<Icon icon="direction-right" size={IconSize.SMALL} />

			<span className="item-content">{children}</span>
		</li>
	);
};