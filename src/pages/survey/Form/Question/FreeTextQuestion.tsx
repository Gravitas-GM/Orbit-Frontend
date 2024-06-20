import {TextArea} from '@blueprintjs/core';
import {ChangeEventHandler, ReactElement, useCallback} from 'react';
import {SurveyFreeTextQuestion} from '../../../../api/Survey/Models/SurveyQuestion';
import {QuestionProps} from './index';

type Props = QuestionProps<SurveyFreeTextQuestion>;

export function FreeTextQuestion({question, onChange}: Props): ReactElement {
	const onTextAreaChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(event => {
		onChange(question, {
			response: event.currentTarget.value,
		});
	}, [question, onChange]);

	return (
		<TextArea fill={true} rows={6} style={{minWidth: '100%'}} onChange={onTextAreaChange} />
	);
}
