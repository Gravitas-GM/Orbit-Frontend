import {BreadcrumbProps} from '@blueprintjs/core';
import {ReactElement, useCallback, useEffect, useMemo, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {ApiError, ValidationFailures} from '../../../api/errors/symfony';
import {BankQuestion, SurveyBankQuestionModel} from '../../../api/Survey/Models/SurveyBankQuestionModel';
import {Classes} from '../../../classes';
import {Breadcrumbs} from '../../../components/Breadcrumbs';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {PageHeader} from '../../../components/PageHeader';
import {withRouteParams, WithRouteParamsProps} from '../../../components/Router/withRouteParams';
import {toaster} from '../../../toaster';
import {QuestionEditor as Editor, SaveFn} from '../QuestionEditor';

function QuestionEditor({params}: WithRouteParamsProps<RouteParams>): ReactElement {
	const [loading, setLoading] = useState(true);
	const [redirect, setRedirect] = useState<string | null>(null);
	const [question, setQuestion] = useState<BankQuestion | null>(null);
	const [validation, setValidation] = useState<ValidationFailures | null>(null);

	useEffect(() => {
		setLoading(true);

		if (!params.question || !params.bank)
			throw new Error('This component requires `:question` and `:bank` in the URL');

		const bankId = parseInt(params.bank, 10);

		if (isNaN(bankId))
			throw new Error(`Invalid \`:bank\` URL parameter: got "${params.bank}", expected number`);

		if (params.question === 'new') {
			setLoading(false);
			return;
		}

		SurveyBankQuestionModel.read(params.question)
			.then(response => {
				setQuestion(response.data);
				setLoading(false);
			})
			.catch(error => {
				toaster.showApiErrorMessage(error);
				setRedirect('..');
			});
	}, [params.question]);

	const onSave: SaveFn = useCallback(async data => {
		try {
			if (question !== null)
				await SurveyBankQuestionModel.update(question.id, data);
			else {
				await SurveyBankQuestionModel.create({
					...data,
					survey: parseInt(params.bank!, 10),
				});
			}
		} catch (error) {
			if (error instanceof ApiError) {
				if (error.isValidationFailure())
					setValidation(error.context.failures);
				else
					setValidation(null);

				toaster.showApiErrorMessage(error);
			} else
				toaster.showUnhandledErrorMessage();

			return false;
		}

		return true;
	}, [question]);

	const isNew = question === null;

	const breadcrumbs: BreadcrumbProps[] = useMemo(() => [
		{
			text: 'Survey Bank',
			href: '/survey/bank',
		},
		{
			text: 'Questions',
			href: '/survey/bank/' + params.bank,
		},
		{
			text: (isNew ? 'Add' : 'Edit') + ' Question',
		},
	], [params.bank, isNew]);

	if (redirect !== null)
		return <Navigate to={redirect} />;
	else if (loading)
		return <FrameLoadingSpinner />;

	return (
		<div className={Classes.PAGE_WRAPPER}>
			<Breadcrumbs items={breadcrumbs} />

			<PageHeader title={`${question ? 'Edit' : 'New'} Survey Question`} />
			<Editor question={question} onSave={onSave} validation={validation} />
		</div>
	);
}

interface RouteParams {
	bank: string,
	question: string,
}

const Wrapped = withRouteParams(QuestionEditor);
export {Wrapped as QuestionEditor};
