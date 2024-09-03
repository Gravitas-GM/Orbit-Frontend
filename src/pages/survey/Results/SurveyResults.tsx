import {ReactElement, useEffect, useState} from 'react';
import {isNotFoundError} from '../../../api/errors';
import {Survey, SurveyModel} from '../../../api/Survey/Models/Survey';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {withRouteParams, WithRouteParamsProps} from '../../../components/Router/withRouteParams';
import {toaster} from '../../../toaster';
import {Results} from './index';

interface RouteParams {
	survey: string,
}

type Props = WithRouteParamsProps<RouteParams>;

function SurveyResults({params}: Props): ReactElement {
	const [survey, setSurvey] = useState<Survey | null>(null);

	useEffect(() => {
		const promise = params.survey ? SurveyModel.read(params.survey) : SurveyModel.readCurrentResults();

		promise
			.then(response => setSurvey(response.data))
			.catch(error => {
				if (isNotFoundError(error) && params.survey)
					toaster.warning('Last week\'s results aren\'t ready yet!');
				else
					toaster.showApiErrorMessage(error);
			});
	}, [params.survey]);

	if (!survey)
		return <FrameLoadingSpinner />;

	return (
		<Results survey={survey} />
	);
}

const Wrapped = withRouteParams(SurveyResults);
export {Wrapped as SurveyResults};
