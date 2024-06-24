import {ReactElement, ReactEventHandler, useCallback, useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {ApiError, ValidationFailures} from '../../../api/errors/symfony';
import {QuestionKind} from '../../../api/Survey';
import {SurveyModel} from '../../../api/Survey/Models/Survey';
import {SurveyQuestion} from '../../../api/Survey/Models/SurveyQuestion';
import {SurveyResponse, SurveySubmissionModel} from '../../../api/Survey/Models/SurveySubmission';
import {Classes} from '../../../classes';
import {FormControls} from '../../../components/FormControls';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {PageHeader} from '../../../components/PageHeader';
import {toaster} from '../../../toaster';
import {Question} from './Question';

export type Response<T extends SurveyResponse = SurveyResponse> = T['response'];
export type ResponseChangeFn<T extends SurveyResponse = SurveyResponse> = (index: number, value: Response<T>) => void;

export function Form(): ReactElement {
	const [loading, setLoading] = useState(true);
	const [redirect, setRedirect] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [dirty, setDirty] = useState(false);

	const [validation, setValidation] = useState<ValidationFailures | null>(null);

	const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
	const [responses, setResponses] = useState<Response[]>([]);

	useEffect(() => {
		(async () => {
			let questions: SurveyQuestion[];

			try {
				questions = await SurveyModel.readCurrent().then(r => r.data.questions);
			} catch (error) {
				if (error instanceof ApiError && error.isNotFound())
					toaster.showSurveyNotReadyWarning('current');
				else if (error instanceof ApiError && error.isSurveyAlreadySubmitted())
					toaster.warning(error.message);
				else
					toaster.showApiErrorMessage(error);

				setRedirect('/');

				return;
			}

			setQuestions(questions);

			setResponses(questions.map(q => {
				if (q.kind === QuestionKind.FreeText)
					return '';
				else if (q.kind === QuestionKind.Scale)
					return q.startValue;
				else if (q.kind === QuestionKind.Choice)
					return 0;

				// Ignored because Typescript knows we've used every variant, but still thinks that this function could
				// return `undefined` if none of the previous `if` statements match.
				// @ts-ignore
				throw new Error(`Unrecognized question kind "${q.kind}"`);
			}));

			setLoading(false);
		})();
	}, []);

	const onResponseChange: ResponseChangeFn = useCallback((index, value) => {
		setResponses(responses => {
			responses[index] = value;
			return [...responses];
		});

		setDirty(true);
	}, []);

	const onSave: ReactEventHandler = useCallback(async event => {
		event.preventDefault();
		setSaving(true);

		const responseData = questions.map((question, index) => ({
			kind: question.kind,
			question: question.id,
			response: responses[index],
		}));

		try {
			await SurveySubmissionModel.create({
				responses: responseData,
			});
		} catch (error) {
			if (error instanceof ApiError && error.isValidationFailure())
				setValidation(error.context.failures);
			else
				setValidation(null);

			toaster.showApiErrorMessage(error);
			setSaving(false);

			return;
		}

		toaster.success('Your survey has been submitted successfully.');
		setRedirect('/survey/results');
	}, [questions, responses]);

	if (redirect !== null)
		return <Navigate to={redirect} />;
	else if (loading)
		return <FrameLoadingSpinner />;

	return (
		<div className={Classes.PAGE_WRAPPER}>
			<PageHeader title="Survey" subtitle="Your answers are anonymous." />

			<form onSubmit={onSave}>
				{questions.map((question, index) => (
					<Question
						key={question.id}
						index={index}
						question={question}
						onChange={onResponseChange}
						validation={validation}
					/>
				))}

				<FormControls onSaveClick={onSave} loading={saving} dirty={dirty} redirectPath="/" />
			</form>
		</div>
	);
}
