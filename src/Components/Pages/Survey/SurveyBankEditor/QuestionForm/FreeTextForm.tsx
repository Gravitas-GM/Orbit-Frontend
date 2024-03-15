import * as React from 'react';
import {FreeTextQuestion} from '../../../../../Api/Survey/Models/BankQuestions';
import {FormProps, FreeTextSaveHandler} from './index';
import {FormControls} from '../../../../FormControls';

type Props = FormProps<FreeTextQuestion, FreeTextSaveHandler>;

interface State {
	prompt: string;
	dirty: boolean;
}

export class FreeTextForm extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = this.copyFromProps();
	}

	public componentDidUpdate(prevProps: Readonly<Props>) {
		if (prevProps.question === this.props.question)
			return;

		this.setState(this.copyFromProps());
	}

	public render() {
		return (
			<div className="question-form">
				<FormControls
					onSaveClick={this.onSave}
					loading={this.props.processing}
					dirty={this.isDirty()}
					redirectPath="/survey/bank"
				/>
			</div>
		);
	}

	private isDirty = () => this.state.dirty || this.props.dirty;

	private onSave = () => this.props.onSave({
		prompt: this.state.prompt,
	});

	private copyFromProps = (): State => ({
		prompt: this.props.question?.prompt ?? '',
		dirty: false,
	});
}
