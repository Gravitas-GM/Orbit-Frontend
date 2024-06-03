import {Card, H4, Icon} from '@blueprintjs/core';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {Role} from '../../../api/roles';
import {Cards} from '../../../components/Cards';
import {useFirewallRoles} from '../../../contexts/SessionContext';
import {IconSize} from '../../../IconSize';
import {Spacing} from '../../../Styles/variables';

export function AdminCards(): React.ReactElement | null {
	const isRoleGranted = useFirewallRoles();

	if (!isRoleGranted(Role.Admin))
		return null;

	return (
		<>
			<H4 style={{marginTop: Spacing.XLarge}}>Admin</H4>

			<Cards>
				<Link to="/game/catalog">
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

				<Link to="/game/sources">
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
			</Cards>
		</>
	);
}
