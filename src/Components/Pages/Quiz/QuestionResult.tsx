import * as React from 'react';
import { Icon, Intent } from "@blueprintjs/core";
import { IconSize } from "../../../IconSize";

export const QuestionResult: React.FC<{ correct: boolean }> = ({ correct }) => {
	return (
		<div className="question-details-card">
			<span>Result:</span>

			{correct ? (
				<Icon size={IconSize.LARGE} icon="tick-circle" intent={Intent.SUCCESS} />
			) : (
				<Icon size={IconSize.LARGE} icon="delete" intent={Intent.DANGER} />
			)}
		</div>
	);
};
