import {Card, H4, Icon, IconProps} from '@blueprintjs/core';
import * as React from 'react';
import {LinkProps} from 'react-router-dom';
import {Cards} from '../../../Components/Cards';
import {MaybeLink} from '../../../Components/MaybeLink';
import {IconSize} from '../../../IconSize';
import {Spacing} from '../../../Styles/variables';

interface NavCardProps {
	icon: IconProps['icon'],
	title: React.ReactNode,
	body: React.ReactNode,
	href?: LinkProps['to'],
	onClick?: () => void,
}

export function NavCard({icon, title, body, href, onClick}: NavCardProps): React.ReactElement {
	return (
		<MaybeLink to={href}>
			<Card interactive={true} onClick={onClick}>
				<Icon icon={icon} size={IconSize.XLARGE} />

				<div>
					<H4>{title}</H4>
					{body}
				</div>
			</Card>
		</MaybeLink>
	);
}

interface NavCardGroupProps {
	children: React.ReactNode,
	title?: React.ReactNode,
}

export function NavCardGroup({title, children}: NavCardGroupProps): React.ReactElement {
	return (
		<>
			{title && <H4 style={{marginTop: Spacing.XLarge}}>{title}</H4>}

			<Cards>
				{children}
			</Cards>
		</>
	);
}

export * from './AdminCards';
export * from './GameCards';
export * from './PointsCards';
export * from './QuizCards';
