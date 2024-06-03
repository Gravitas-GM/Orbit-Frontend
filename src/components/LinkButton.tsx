import * as React from 'react';
import {Link, LinkProps} from 'react-router-dom';
import {Button, ButtonProps} from '@blueprintjs/core';
import {Classes} from '../classes';

type Props = Pick<LinkProps, 'to' | 'replace'> & ButtonProps;

export const LinkButton: React.FC<Props> = ({to, replace, ...buttonProps}) => (
	<Link to={to} replace={replace} className={Classes.PLAIN_LINK}>
		<Button {...buttonProps} />
	</Link>
);
