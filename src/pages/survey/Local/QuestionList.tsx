import {ReactElement, useCallback, useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {ApiError} from '../../../api/errors/symfony';
import {Survey, SurveyModel} from '../../../api/Survey/Models/Survey';
import {SurveyQuestionModel} from '../../../api/Survey/Models/SurveyQuestion';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {withRouteParams} from '../../../components/Router/withRouteParams';
import {toaster} from '../../../toaster';
import {allSettled, isRejectedResult} from '../../../utility/promise';
import {DeleteFn, Questions} from '../Questions';

function QuestionList(): ReactElement {
	// Also used to derive our loading state; `null` means we are still loading.
	const [survey, setSurvey] = useState<Survey | null>(null);

	// Used to force a complete refresh e.g. after deleting items.
	const [sequence, setSequence] = useState(0);

	const [redirect, setRedirect] = useState<string | null>(null);

	const onQuestionDelete: DeleteFn<Survey> = useCallback(async targets => {
		if (targets.length === 0)
			return;

		const promises = targets.map(target => SurveyQuestionModel.deleteFromNext(target.id));
		const results = await allSettled(promises);
		const failures = results.filter(isRejectedResult);

		if (failures.length > 0)
			toaster.warning('Some items could not be deleted. Please try again later.');
		else
			toaster.success(`Question${results.length !== 1 ? 's' : ''} deleted successfully.`);

		setSequence(s => s + 1);
	}, []);

	// Be aware that with strict mode enabled, a failure during this effect will cause the browser to navigate back
	// twice, since strict mode runs effects twice. This should only be an issue in development.
	useEffect(() => {
		// Ensure that survey is `null` when loading data to hide any UI changes behind a loading spinner.
		setSurvey(null);

		SurveyModel.readNext()
			.then(response => {
				setSurvey(response.data);
			})
			.catch(error => {
				if (error instanceof ApiError && error.isNotFound()) {
					toaster.warning('Next week\'s survey isn\'t ready for your account yet. Check back later!');
				} else
					toaster.showApiErrorMessage(error);

				setRedirect('/');
			});
	}, [sequence]);

	if (redirect !== null)
		return <Navigate to={redirect} />;
	else if (!survey)
		return <FrameLoadingSpinner />;

	return (
		<Questions
			title="Next Survey Questions"
			survey={survey}
			onQuestionDelete={onQuestionDelete}
			baseUri="/survey/next/questions"
		/>
	);
}

const Wrapped = withRouteParams(QuestionList);
export {Wrapped as QuestionList};
