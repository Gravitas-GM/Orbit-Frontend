import {HTMLTable, Icon} from '@blueprintjs/core';
import {ReactElement, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Projection} from '../../api';
import {Survey, SurveyModel} from '../../api/Survey/Models/Survey';
import {FrameLoadingSpinner} from '../../components/FrameLoadingSpinner';
import {ObjectList} from '../../components/ObjectList';
import {PageContent} from '../../components/PageContent';
import {PageHeader} from '../../components/PageHeader';
import {toaster} from '../../toaster';
import {formatDate} from '../../utility/date';

const PROJECTION: Projection = {
	id: true,
	startedDate: true,
	completedDate: true,
	'submissions.id': true,
};

export function History(): ReactElement {
	// Also used to derive our loading state; a null value indicates the component is still loading.
	const [surveys, setSurveys] = useState<Survey[] | null>(null);

	useEffect(() => {
		SurveyModel.list(PROJECTION, {completedDate: {$neq: null}})
			.then(r => {
				const sorted = r.data.sort((a, b) => b.completedDate!.getTime() - a.completedDate!.getTime());
				setSurveys(sorted);
			})
			.catch(error => {
				toaster.showApiErrorMessage(error);
			});
	}, []);

	if (surveys === null)
		return <FrameLoadingSpinner />;

	return (
		<PageContent>
			<PageHeader title="Previous Surveys" />

			<ObjectList items={surveys}>
				{items => (
					<HTMLTable>
						<thead>
							<tr>
								<th>Started Date</th>
								<th>Ended Date</th>
								<th>Responses</th>
								<th />
							</tr>
						</thead>

						<tbody>
							{items.map(item => (
								<tr key={item.id}>
									<td>{formatDate(item.startedDate)}</td>
									<td>{formatDate(item.completedDate!)}</td>

									<td>
										{item.submissions.length} submission{item.submissions.length !== 1 ?
										's' :
										''}
									</td>

									<td style={{textAlign: 'right'}}>
										<Link to={`/survey/results/${item.id}`}>
											<Icon icon="eye-open" />
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</HTMLTable>
				)}
			</ObjectList>
		</PageContent>
	);
}
