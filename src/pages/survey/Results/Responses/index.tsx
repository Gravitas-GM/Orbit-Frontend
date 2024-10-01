import {ReactElement} from 'react';
import {Question, QuestionKind} from '../../../../api/Survey';
import {isSurveySummarized, Survey} from '../../../../api/Survey/Models/Survey';
import {NonIdealState} from '../../../../components/NonIdealState';
import {ChoiceResponse} from './ChoiceResponse';
import {FreeTextResponse} from './FreeTextResponse';
import {ScaleResponse} from './ScaleResponse';
import './index.scss';

interface Props {
	survey: Survey<boolean>,
}

export function Responses({survey}: Props): ReactElement {
	if (!isSurveySummarized(survey))
		return <NonIdealState title="Survey responses are not available yet." />;

	return (
		<div id="survey-responses">
			{survey.questions.map(item => (
				<div className="question-item" key={item.id}>
					<Response question={item} />
				</div>
			))}
		</div>
	);
}

interface ResponseProps {
	question: Question<true>,
}

function Response({question}: ResponseProps): ReactElement {
	switch (question.kind) {
		case QuestionKind.Scale:
			return <ScaleResponse question={question} />;

		case QuestionKind.FreeText:
			return <FreeTextResponse question={question} />;

		case QuestionKind.Choice:
			return <ChoiceResponse question={question} />;

		default:
			// @ts-ignore
			throw new Error(`Unrecognized question kind "${question.kind}"`);
	}
}
