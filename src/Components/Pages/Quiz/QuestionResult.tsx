import React from "react";
import { Icon, Intent } from "@blueprintjs/core";
import { IconSize } from "../../../IconSize";
import { classNames } from "../../Utility/dom";

interface IProps {
	correct: boolean;
	selected: boolean;
	children?: React.ReactNode;
}

export const QuestionResult: React.FC<IProps> = ({ correct, selected, children }) => {

	const markAsCorrect = React.useMemo(() => {
		return correct ? 'question-correct' : 'question-wrong'
	}, [correct]);

	return (
		<div className={selected ? classNames('question-results-card', 'question-selected', markAsCorrect) : 'question-details-card'}>

			{selected && (
				<Icon
					icon={correct ? "tick" : "cross"}
					intent={correct ? Intent.SUCCESS : Intent.DANGER}
					size={IconSize.SMALL}
				/>
			)}

			<>
				{children}
			</>
		</div>
	);
};
