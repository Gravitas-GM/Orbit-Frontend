import {Breadcrumb, BreadcrumbProps, Breadcrumbs as BPBreadcrumbs} from '@blueprintjs/core';
import {ReactElement} from 'react';
import {MaybeLink} from '../MaybeLink';
import './index.scss';

interface Props {
	items: BreadcrumbProps[],
}

export function Breadcrumbs({items}: Props): ReactElement {
	return (
		<BPBreadcrumbs
			items={items}
			breadcrumbRenderer={renderItem}
		/>
	);
}

function renderItem({href, ...props}: BreadcrumbProps): ReactElement {
	return (
		<MaybeLink to={href}>
			<Breadcrumb {...props} />
		</MaybeLink>
	);
}
