import * as React from 'react';
import {CardsGroup} from './CardsGroup';
import {Card, Icon, H4} from '@blueprintjs/core';
import {Link} from 'react-router-dom';
import {IconSize} from '../../IconSize';
import {Permission, PermissionContext} from '../../Permission';
import {Role, RoleContext} from '../../Role';

export const AdminCards: React.FC = () => {
	const [isGranted] = React.useContext(PermissionContext);
	const [hasRole] = React.useContext(RoleContext);

	if (!isGranted(Permission.ADMIN))
		return null;

	return (
		<CardsGroup title="Admin">
			<Link to="/catalog">
				<Card interactive={true}>
					<Icon icon="layers" size={IconSize.XLARGE} />
					<div>
						<H4>Game Catalog</H4>
						<p>Browse our Game Catalog and start playing one of our games.</p>
					</div>
				</Card>
			</Link>

			<Link to="/users">
				<Card interactive={true}>
					<Icon icon="people" size={35} />
					<div>
						<H4>Users List</H4>

						<p>Browse users list, manage users, and give points.</p>
					</div>
				</Card>
			</Link>

			<Link to="/departments">
				<Card interactive={true}>
					<Icon icon="shop" size={35} />
					<div>
						<H4>Departments</H4>

						<p>Manage Departments and assign users.</p>
					</div>
				</Card>
			</Link>

			<Link to="/sources">
				<Card interactive={true}>
					<Icon icon="bank-account" size={35} />
					<div>
						<H4>Sources</H4>

						<p>Manage point sources and give points to multiple users.</p>
					</div>
				</Card>
			</Link>

			<Link to="/quiz/questions">
				<Card interactive={true}>
					<Icon icon="clipboard" size={35} />
					<div>
						<H4>Questions</H4>

						<p>Manage quiz questions.</p>
					</div>
				</Card>
			</Link>

			<Link to="/quiz/tags">
				<Card interactive={true}>
					<Icon icon="tag" size={35} />

					<div>
						<H4>Question Tags</H4>

						<p>Manage question tags and tag assignment to users.</p>
					</div>
				</Card>
			</Link>

			<Link to="/quiz/settings">
				<Card interactive={true}>
					<Icon icon="cog" size={35} />
					<div>
						<H4>Quiz Settings</H4>

						<p>Manage quiz frequency, question count, and point reward.</p>
					</div>
				</Card>
			</Link>

			<Link to="/survey/next">
				<Card interactive={true}>
					<Icon icon="th-derived" size={35} />
					<div>
						<H4>Next Survey</H4>

						<p>View next week's survey and customize.</p>
					</div>
				</Card>
			</Link>

			<Link to="/survey/history">
				<Card interactive={true}>
					<Icon icon="history" size={35} />
					<div>
						<H4>Survey History</H4>

						<p>View historical survey results.</p>
					</div>
				</Card>
			</Link>

			<Link to="/survey/settings">
				<Card interactive={true}>
					<Icon icon="cog" size={35} />
					<div>
						<H4>Survey Settings</H4>

						<p>Manage survey reset day, and notification settings.</p>
					</div>
				</Card>
			</Link>

			{hasRole(Role.ADMIN) && (
				<Link to="/survey/bank">
					<Card interactive={true}>
						<Icon icon="projects" size={35} />
						<div>
							<H4>Survey Bank</H4>

							<p>Manage bank of weekly surveys.</p>
						</div>
					</Card>
				</Link>
			)}
		</CardsGroup>
	);
};
