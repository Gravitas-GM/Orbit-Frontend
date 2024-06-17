import {useImperativeHandle} from 'react';
import {BaseFreeTextQuestion, QuestionKind} from '../../../../api/Survey';
import {QuestionFormProps} from './index';

type Props = QuestionFormProps<BaseFreeTextQuestion>;

export function FreeTextQuestion({save}: Props): null {
	useImperativeHandle(save, () => () => ({
		kind: QuestionKind.FreeText,
	}), []);

	return null;
}
