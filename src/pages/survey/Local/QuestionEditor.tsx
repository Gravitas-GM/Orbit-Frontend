import {BreadcrumbProps} from '@blueprintjs/core';
import {ReactElement, useCallback, useEffect, useMemo, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {ApiError, ValidationFailures} from '../../../api/errors/symfony';
import {Question} from '../../../api/Survey';
import {SurveyQuestionModel} from '../../../api/Survey/Models/SurveyQuestion';
import {Classes} from '../../../classes';
import {Breadcrumbs} from '../../../components/Breadcrumbs';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {PageHeader} from '../../../components/PageHeader';
import {withRouteParams, WithRouteParamsProps} from '../../../components/Router/withRouteParams';
import {toaster} from '../../../toaster';
import {QuestionEditor as Editor, SaveFn} from '../QuestionEditor';

function QuestionEditor({params}: WithRouteParamsProps<RouteParams>): ReactElement {
	const [redirect, setRedirect] = useState<string | null>(null);
	const [question, setQuestion] = useState<Question | null>(null);
	const [loading, setLoading] = useState(true);
	const [validation, setValidation] = useState<ValidationFailures | null>(null);

	useEffect(() => {
		setLoading(true);

		if (!params.question)
			throw new Error('This component requires `:question` in the URL');
		else if (params.question === 'new') {
			setLoading(false);
			return;
		}

		SurveyQuestionModel.readFromNext(params.question)
			.then(response => {
				setQuestion(response.data);
				setLoading(false);
			})
			.catch(error => {
				toaster.showApiErrorMessage(error);
				setRedirect('../..');
			});
	}, [params.question]);

	const onSave = useCallback<SaveFn>(async data => {
		try {
			if (question)
				await SurveyQuestionModel.updateInNext(question.id, data);
			else
				await SurveyQuestionModel.createInNext(data);
		} catch (error) {
			if (error instanceof ApiError && error.isValidationFailure())
				setValidation(error.context.failures);
			else
				setValidation(null);

			toaster.showApiErrorMessage(error);

			return false;
		}

		return true;
	}, [question]);

	const isNew = question === null;

	const breadcrumpbs: BreadcrumbProps[] = useMemo(() => [
		{
			text: 'Next Survey',
			href: '/survey/next',
		},
		{
			text: `${isNew ? 'Add' : 'Edit'} Question`,
		},
	], [params.question, isNew]);

	if (redirect !== null)
		return <Navigate to={redirect} relative="path" />;
	else if (loading)
		return <FrameLoadingSpinner />;

	return (
		<div className={Classes.PAGE_WRAPPER}>
			<Breadcrumbs items={breadcrumpbs} />

			<PageHeader title={`${question ? 'Edit' : 'New'} Question`} />
			<Editor question={question} onSave={onSave} validation={validation} />
		</div>
	);
}

interface RouteParams {
	question: string,
}

const Wrapped = withRouteParams(QuestionEditor);
export {Wrapped as QuestionEditor};
