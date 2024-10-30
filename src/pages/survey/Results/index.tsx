import {ReactElement, useMemo} from 'react';
import {Survey} from '../../../api/Survey/Models/Survey';
import {PageContent} from '../../../components/PageContent';
import {PageHeader} from '../../../components/PageHeader';
import {formatDate} from '../../../utility/date';
import {Responses} from './Responses';

interface Props {
	survey: Survey;
}

export function Results({survey}: Props): ReactElement {
	const responseCount = useMemo(() => {
		return survey.questions[0]?.responses.length ?? 0;
	}, [survey.questions]);

	return (
		<PageContent>
			<PageHeader
				title={`Survey from ${formatDate(survey.startedDate)}`}
				subtitle={`${responseCount} response${responseCount !== 1 ? 's' : ''}`}
			/>

			<Responses survey={survey} />
		</PageContent>
	);
}
