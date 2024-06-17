import {Button, FormGroup, MenuItem, TextArea} from '@blueprintjs/core';
import {ItemRenderer} from '@blueprintjs/select';
import {ChangeEvent, PureComponent, ReactElement} from 'react';
import {ValidationFailures} from '../../api/errors/symfony';
import {getKindDisplayName, Question, QuestionKind} from '../../api/Survey';
import {Grid} from '../../components/Grid';
import {ItemSelectFn, Select} from '../../components/Select/Select';
import {ValidationAwareFormGroup} from '../../components/ValidationAwareFormGroup';
import {ucwords} from '../../utility/string';
import {Question as QuestionComponent, QuestionSaveFn} from './Bank/Question';

export type SaveFn<T = Question> = (question: T) => Promise<boolean>;

interface Props {
	question: Question | null,
	onSave: SaveFn,
	validation: ValidationFailures | null,
}

interface State {
	kind: QuestionKind,
	prompt: string,
	dirty: boolean,
}

export class QuestionEditor extends PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			kind: this.props.question?.kind ?? QuestionKind.FreeText,
			prompt: this.props.question?.prompt ?? '',
			dirty: false,
		};
	}

	public componentDidUpdate(prevProps: Readonly<Props>): void {
		if (prevProps.question === this.props.question)
			return;

		// The `kind` property is intentionally not copied here. Only editors in the "new" state (did not receive a
		// question ID in the URL params) can change the question kind. Once a question has been created, the value
		// of `kind` is locked in.
		this.setState({
			prompt: this.props.question?.prompt ?? '',
		});
	}

	public render(): ReactElement {
		return (
			<form>
				<Grid columns={2}>
					<ValidationAwareFormGroup label="Prompt" labelFor="prompt" failures={this.props.validation}>
						<TextArea
							style={{minWidth: '100%'}}
							fill={true}
							rows={5}
							name="prompt"
							value={this.state.prompt}
							onChange={this.onPromptChange}
						/>
					</ValidationAwareFormGroup>

					<FormGroup label="Question Kind" labelFor="kind">
						<Select
							items={Object.values(QuestionKind)}
							itemRenderer={this.renderQuestionKind}
							onItemSelect={this.onKindChange}
							disabled={this.props.question !== null}
							resetOnSelect={false}
							fill={true}
						>
							<Button
								text={ucwords(this.state.kind)}
								rightIcon="caret-down"
								disabled={this.props.question !== null}
								fill={true}
								alignText="left"
							/>
						</Select>
					</FormGroup>
				</Grid>

				<QuestionComponent
					kind={this.state.kind}
					question={this.props.question}
					dirty={this.state.dirty}
					onSave={this.onQuestionSave}
					validation={this.props.validation}
				/>
			</form>
		);
	}

	private renderQuestionKind: ItemRenderer<QuestionKind> = (item, props) => {
		if (!props.modifiers.matchesPredicate)
			return null;

		return (
			<MenuItem
				key={item}
				icon={item === this.state.kind ? 'tick' : 'blank'}
				text={getKindDisplayName(item)}
				active={props.modifiers.active}
				disabled={props.modifiers.disabled}
				onClick={props.handleClick}
				onFocus={props.handleFocus}
				roleStructure="listoption"
			/>
		);
	};

	private onPromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => this.setState({
		prompt: event.currentTarget.value,
		dirty: true,
	});

	private onKindChange: ItemSelectFn<QuestionKind> = kind => {
		if (this.props.question !== null)
			return;

		this.setState({
			kind,
		});
	};

	private onQuestionSave: QuestionSaveFn = question => this.props.onSave({
		...question as Question,
		prompt: this.state.prompt,
	});
}
