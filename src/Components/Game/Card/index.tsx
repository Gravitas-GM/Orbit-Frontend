import {Icon, IconName} from '@blueprintjs/core';
import './Card.scss';

interface IProps {
	title: string;
	icon: IconName;
	children: React.ReactNode;
}

export const GameCard: React.FC<IProps> = props => {
	return (
		<div className="gm-card">
			<header className="gm-card-header">
				<Icon icon={props.icon} style={{marginRight: '0.5rem'}} />
				{props.title}
			</header>

			<div className="gm-card-content">{props.children}</div>
		</div>
	);
};
