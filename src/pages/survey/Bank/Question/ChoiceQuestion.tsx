import {Button, ControlGroup, FormGroup, H3, InputGroup} from '@blueprintjs/core';
import {ChangeEvent, ReactElement, useCallback, useImperativeHandle, useState} from 'react';
import {ValidationFailures} from '../../../../api/errors/symfony';
import {BaseChoiceQuestion, QuestionKind} from '../../../../api/Survey';
import {PageHeader} from '../../../../components/PageHeader';
import {ValidationAwareFormGroup} from '../../../../components/ValidationAwareFormGroup';
import {DirtyChangeFn, QuestionFormProps} from './index';

type Props = QuestionFormProps<BaseChoiceQuestion>;
type Choices = { [key: string]: string };

export function ChoiceQuestion({question, save, onDirtyChange, validation}: Props): ReactElement {
	const [choices, setChoices] = useState(() => {
		const choices: Choices = {};

		for (const choice of question?.choices ?? [])
			choices[window.crypto.randomUUID()] = choice;

		return choices;
	});

	const onAddButtonClick = useCallback(() => {
		setChoices(choices => ({
			...choices,
			[window.crypto.randomUUID()]: '',
		}));
	}, []);

	const onItemChange = useCallback<ItemChangeFn>((id, value) => {
		setChoices(choices => ({
			...choices,
			[id]: value,
		}));
	}, []);

	const onItemDelete = useCallback<ItemDeleteFn>(id => {
		setChoices(choices => {
			const copy = {...choices};
			delete copy[id];

			return copy;
		});

		onDirtyChange(true);
	}, []);

	useImperativeHandle(save, () => {
		return () => ({
			kind: QuestionKind.Choice,
			choices: Object.values(choices),
		});
	}, [choices]);

	return (
		<div>
			<PageHeader title="Choices" headerComponent={H3}>
				<div>
					<Button intent="primary" icon="add" text="Add Item" onClick={onAddButtonClick} />
				</div>
			</PageHeader>

			{Object.entries(choices).map(([id, choice], index) => (
				<ChoiceItem
					key={id}
					id={id}
					index={index}
					item={choice}
					validation={validation}
					onChange={onItemChange}
					onDelete={onItemDelete}
					onDirtyChange={onDirtyChange}
				/>
			))}
		</div>
	);
}

type ItemDeleteFn = (id: string) => void;
type ItemChangeFn = (id: string, value: string) => void;

interface ChoiceItemProps {
	id: string,
	index: number,
	item: string,
	validation: ValidationFailures | null,
	onDirtyChange: DirtyChangeFn,
	onDelete: ItemDeleteFn,
	onChange: ItemChangeFn,
}

function ChoiceItem({id, index, item, validation, onDirtyChange, onChange, onDelete}: ChoiceItemProps): ReactElement {
	const onValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		onChange(id, event.currentTarget.value);
		onDirtyChange(true);
	}, [id]);

	const onDeleteClick = useCallback(() => {
		onDelete(id);
	}, [id, onDelete]);

	const fieldPath = `choice[${index}]`;

	return (
		<ControlGroup>
			<ValidationAwareFormGroup labelFor={fieldPath} failures={validation} fill={true}>
				<InputGroup name={fieldPath} value={item} onChange={onValueChange} />
			</ValidationAwareFormGroup>

			<FormGroup>
				<Button intent="danger" icon="cross" minimal={true} onClick={onDeleteClick} tabIndex={-1} />
			</FormGroup>
		</ControlGroup>
	);
}
