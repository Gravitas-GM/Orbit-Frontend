import {ReactElement} from 'react';
import {Survey} from '../../../api/Survey/Models/Survey';
import {PageHeader} from '../../../components/PageHeader';
import {formatDate} from '../../../utility/date';

interface Props {
	survey: Survey
}

export function Results({survey}: Props): ReactElement {
	return (
		<div>
			<PageHeader title={`Survey from ${formatDate(survey.startedDate)}`} />
		</div>
	);
}
