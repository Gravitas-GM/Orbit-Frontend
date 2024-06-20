import {TextArea} from '@blueprintjs/core';
import {ChangeEventHandler, ReactElement, useCallback, useState} from 'react';
import {SurveyFreeTextQuestion} from '../../../../api/Survey/Models/SurveyQuestion';
import {QuestionProps} from './index';

type Props = QuestionProps<SurveyFreeTextQuestion>;

export function FreeTextQuestion({question}: Props): ReactElement {
	const [value, setValue] = useState('');

	const onChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(event => {
		setValue(event.currentTarget.value);
	}, []);

	return (
		<TextArea fill={true} rows={6} style={{minWidth: '100%'}} onChange={onChange} value={value} />
	);
}
