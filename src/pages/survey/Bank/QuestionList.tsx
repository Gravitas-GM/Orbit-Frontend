import {BreadcrumbProps} from '@blueprintjs/core';
import {ReactElement, useCallback, useEffect, useMemo, useState} from 'react';
import {BankSurvey, SurveyBankModel} from '../../../api/Survey/Models/SurveyBankModel';
import {SurveyBankQuestionModel} from '../../../api/Survey/Models/SurveyBankQuestionModel';
import {Classes} from '../../../classes';
import {Breadcrumbs} from '../../../components/Breadcrumbs';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {withRouteParams, WithRouteParamsProps} from '../../../components/Router/withRouteParams';
import {toaster} from '../../../toaster';
import {allSettled, isRejectedResult} from '../../../utility/promise';
import {DeleteFn, Questions} from '../Questions';

function QuestionList({params}: WithRouteParamsProps<RouteParams>): ReactElement {
	// Used to trigger a component refresh e.g. after deleting items.
	const [sequence, setSequence] = useState(0);
	const [survey, setSurvey] = useState<BankSurvey | null>(null);

	useEffect(() => {
		// Ensure survey is `null` when reloading data, to hide any UI changes behind the loading spinner.
		setSurvey(null);

		if (!params.bank)
			throw new Error('Cannot load bank question list without an ID');

		SurveyBankModel.read(params.bank).then(r => setSurvey(r.data));
	}, [params.bank, sequence]);

	const onQuestionsDelete: DeleteFn<BankSurvey> = useCallback(async targets => {
		if (targets.length === 0)
			return;

		const promises = targets.map(item => SurveyBankQuestionModel.delete(item.id));
		const results = await allSettled(promises);
		const failures = results.filter(isRejectedResult);

		if (failures.length > 0)
			toaster.warning('Some items could not be deleted. Please try again later.');
		else
			toaster.success(`Question${results.length !== 1 ? 's' : ''} deleted successfully.`);

		setSequence(s => s + 1);
	}, []);

	const breadcrumbs: BreadcrumbProps[] = useMemo(() => [
		{
			href: '/survey/bank',
			text: 'Survey Bank',
		},
		{
			text: 'Questions',
		},
	], []);

	if (survey === null)
		return <FrameLoadingSpinner />;

	return (
		<>
			<div className={Classes.PAGE_WRAPPER}>
				<Breadcrumbs items={breadcrumbs} />
			</div>

			<Questions
				survey={survey}
				baseUri={`/survey/bank/${params.bank}/questions`}
				onQuestionDelete={onQuestionsDelete}
			/>
		</>
	);
}

interface RouteParams {
	bank: string,
}

const Wrapped = withRouteParams(QuestionList);
export {Wrapped as QuestionList};
