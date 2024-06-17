import {MutableRefObject, ReactElement, ReactNode, useCallback, useRef, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {ValidationFailures} from '../../../../api/errors/symfony';
import {
	BaseChoiceQuestion,
	BaseFreeTextQuestion,
	BaseScaleQuestion,
	Question,
	QuestionKind,
} from '../../../../api/Survey';
import {FormControls} from '../../../../components/FormControls';
import {toaster} from '../../../../toaster';
import {SaveFn} from '../../QuestionEditor';
import {ChoiceQuestion} from './ChoiceQuestion';
import {FreeTextQuestion} from './FreeTextQuestion';
import {ScaleQuestion} from './ScaleQuestion';

export interface QuestionFormProps<T extends Question> {
	question: T | null,
	save: MutableRefObject<QuestionSaveHandlerFn | undefined>,
	onDirtyChange: DirtyChangeFn,
	validation: ValidationFailures | null,
}

export type QuestionSaveFn<T extends Question = Question> = SaveFn<Omit<T, 'prompt' | 'id'>>;
export type QuestionSaveHandlerFn = () => Omit<Question, 'prompt' | 'id'>;

export type DirtyChangeFn = (dirty: boolean) => void;

interface QuestionProps {
	kind: QuestionKind,
	question: Question | null,
	dirty: boolean,
	onSave: QuestionSaveFn,
	validation: ValidationFailures | null,
}

export function Question({kind, question, onSave, validation, dirty: dirtyParent}: QuestionProps): ReactElement | null {
	const saveHandler = useRef<QuestionSaveHandlerFn>();
	const [dirty, setDirty] = useState(false);
	const [saving, setSaving] = useState(false);
	const [redirect, setRedirect] = useState<string | null>(null);

	const onDirtyChange = useCallback<DirtyChangeFn>(setDirty, []);

	const onSaveClick = useCallback(async () => {
		if (!saveHandler.current)
			throw new Error('Save handler has not been set!');

		setSaving(true);
		const success = await onSave(saveHandler.current());
		setSaving(false);

		if (success) {
			toaster.success(`Question ${question ? 'updated' : 'created'} successfully.`);
			setRedirect('../..');
		}
	}, [onSave, question]);

	if (redirect !== null)
		return <Navigate to={redirect} relative="path" />;

	let questionForm: ReactNode = null;

	switch (kind) {
		case QuestionKind.Choice:
			questionForm = (
				<ChoiceQuestion
					question={question as BaseChoiceQuestion | null}
					onDirtyChange={onDirtyChange}
					save={saveHandler}
					validation={validation}
				/>
			);

			break;

		case QuestionKind.Scale:
			questionForm = (
				<ScaleQuestion
					question={question as BaseScaleQuestion | null}
					onDirtyChange={onDirtyChange}
					save={saveHandler}
					validation={validation}
				/>
			);

			break;

		case QuestionKind.FreeText:
			questionForm = (
				<FreeTextQuestion
					question={question as BaseFreeTextQuestion | null}
					save={saveHandler}
					onDirtyChange={onDirtyChange}
					validation={validation}
				/>
			);

			break;
	}

	return (
		<>
			{questionForm}

			<FormControls
				onSaveClick={onSaveClick}
				loading={saving}
				dirty={dirty || dirtyParent}
				redirectPath="../.."
				redirectRelative="path"
			/>
		</>
	);
}
