import {ReactElement} from 'react';
import {Classes} from '../../../classes';
import {PageHeader} from '../../../components/PageHeader';

export function Bank(): ReactElement {
	return (
		<div className={Classes.PAGE_WRAPPER}>
			<PageHeader title="Survey Bank" />
		</div>
	);
}
