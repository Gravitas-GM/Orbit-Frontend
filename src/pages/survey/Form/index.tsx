import {ReactElement, useCallback, useEffect, useState} from 'react';
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

	useEffect(() => {
		SurveyModel.readCurrent()
			.then(response => {
				setQuestions(response.data.questions.sort((a, b) => a.sort - b.sort));
			})
			.catch(error => {
				toaster.showApiErrorMessage(error);
			});
	}, []);

	const onResponseChange: ChangeFn = useCallback((question, args) => {
		setQuestions(questions => {
			if (!questions)
				return questions;

			const index = questions.indexOf(question);

			if (index === -1)
				throw new Error('Could not find question index; something must be very wrong.');

			questions[index] = {
				...question,
				...args,
			};

			return [...questions];
		});
	}, []);

	if (questions === null)
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
