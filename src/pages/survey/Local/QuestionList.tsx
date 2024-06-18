import {ReactElement, useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ApiError} from '../../../api/errors/symfony';
import {Survey, SurveyModel} from '../../../api/Survey/Models/SurveyModel';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {withRouteParams} from '../../../components/Router/withRouteParams';
import {toaster} from '../../../toaster';
import {DeleteFn, Questions} from '../Questions';

function QuestionList(): ReactElement {
	const [survey, setSurvey] = useState<Survey | null>(null);
	const navigate = useNavigate();

	const onQuestionDelete: DeleteFn<Survey> = useCallback(async () => {
	}, []);

	// Be aware that with strict mode enabled, a failure during this effect will cause the browser to navigate back
	// twice, since strict mode runs effects twice. This should only be an issue in development.
	useEffect(() => {
		SurveyModel.readNext()
			.then(response => {
				setSurvey(response.data);
			})
			.catch(error => {
				if (error instanceof ApiError && error.isNotFound()) {
					toaster.warning('Next week\'s survey isn\'t ready for your account yet. Check back later!');
					navigate(-1);
				} else
					toaster.showApiErrorMessage(error);
			});
	}, []);

	if (!survey)
		return <FrameLoadingSpinner />;

	return (
		<Questions
			title="Next Survey Questions"
			survey={survey}
			onQuestionDelete={onQuestionDelete}
			baseUri="/survey/next"
		/>
	);
}

const Wrapped = withRouteParams(QuestionList);
export {Wrapped as QuestionList};
