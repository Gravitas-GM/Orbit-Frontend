import {H3} from '@blueprintjs/core';
import {ReactElement, ReactNode, useMemo} from 'react';
import {BaseFreeTextQuestion} from '../../../../api/Survey';
import './FreeTextResponse.scss';
import {ucwords} from '../../../../utility/string';

interface Props {
	question: BaseFreeTextQuestion<true>,
}

export function FreeTextResponse({question}: Props): ReactElement {
	const items: string[] = useMemo(() => {
		return Object.entries(question.summary.frequencies)
			.sort(([_aKey, a], [_bKey, b]) => b - a)
			.slice(0, 5)
			.map(([key, _]) => ucwords(key));
	}, [question.summary.frequencies]);

	return (
		<div className="free-text">
			<Group>
				<Keyword text={items[0]} />
			</Group>

			<Group>
				<Keyword text={items[1]} />
				<Prompt text={question.prompt} />
				<Keyword text={items[2]} />
			</Group>

			<Group>
				<Keyword text={items[3]} />
				<Keyword text={items[4]} />
			</Group>
		</div>
	);
}

interface GroupProps {
	children: ReactNode,
}

function Group({children}: GroupProps): ReactElement {
	return <div className="group">{children}</div>;
}

interface PromptProps {
	text: ReactNode,
}

function Prompt({text}: PromptProps): ReactElement {
	return <div className="prompt"><H3>{text}</H3></div>;
}

interface KeywordProps {
	text: ReactNode,
}

function Keyword({text}: KeywordProps): ReactElement {
	return <div className="keyword">{text}</div>;
}
