import {ReactElement, useCallback, useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {ApiError} from '../../../api/errors/symfony';
import {SurveyModel} from '../../../api/Survey/Models/Survey';
import {SurveyQuestion} from '../../../api/Survey/Models/SurveyQuestion';
import {Classes} from '../../../classes';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {PageHeader} from '../../../components/PageHeader';
import {toaster} from '../../../toaster';
import {ChangeFn, Question} from './Question';

export function Form(): ReactElement {
	// Also used to derive loading state; a `null` value means the component is still loading.
	const [questions, setQuestions] = useState<SurveyQuestion[] | null>(null);
	const [redirect, setRedirect] = useState<string | null>(null);

	useEffect(() => {
		SurveyModel.readCurrent()
			.then(response => {
				setQuestions(response.data.questions.sort((a, b) => a.sort - b.sort));
			})
			.catch(error => {
				if (error instanceof ApiError && error.isNotFound())
					toaster.showSurveyNotReadyWarning('current');
				else
					toaster.showApiErrorMessage(error);

				setRedirect('/');
			});
	}, []);

	const onResponseChange: ChangeFn = useCallback((index, args) => {
		setQuestions(questions => {
			if (!questions)
				return questions;

			questions[index] = {
				...questions[index],
				...args,
			};

			return [...questions];
		});
	}, []);

	if (redirect !== null)
		return <Navigate to={redirect} />;
	else if (questions === null)
		return <FrameLoadingSpinner />;

	return (
		<div className={Classes.PAGE_WRAPPER}>
			<PageHeader title="Survey" subtitle="Your answers are anonymous." />

			{questions.map((question, index) => (
				<Question
					key={question.id}
					index={index}
					question={question}
					onChange={onResponseChange}
					validation={null}
				/>
			))}
		</div>
	);
}
