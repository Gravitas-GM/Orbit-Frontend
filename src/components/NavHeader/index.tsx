import {Alignment, Button, Classes, Icon, IconSize, Navbar} from '@blueprintjs/core';
import {Popover2 as Popover} from '@blueprintjs/popover2';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {Permission} from '../../api/permissions';
import {useMaybeAppUser, usePermissions} from '../../contexts/SessionContext';
import {renderUserName} from '../../utility/string';
import {GameMenu} from './GameMenu';
import './index.scss';
import {QuizMenu} from './QuizMenu';
import {SurveyMenu} from './SurveyMenu';
import {UserMenu} from './UserMenu';

export function NavHeader(): React.ReactElement | null {
	const user = useMaybeAppUser();
	const isPermissionGranted = usePermissions();

	if (!user)
		return null;

	return (
		<>
			<Navbar id="nav-header" className={Classes.NAVBAR} fixedToTop={true}>
				<Navbar.Group align={Alignment.LEFT}>
					<Navbar.Heading>
						<Link to="/" className="plain-link">Happy Orbit</Link>
					</Navbar.Heading>

					<Navbar.Divider />

					<Link to="/" className="plain-link">
						<Button
							text="Home"
							minimal
						/>
					</Link>

					<Popover content={<GameMenu />}>
						<Button
							text="Game"
							minimal={true}
							rightIcon="caret-down"
						/>
					</Popover>

					<Popover content={<QuizMenu />}>
						<Button text="Quiz" minimal={true} rightIcon="caret-down" />
					</Popover>

					<Popover content={<SurveyMenu />}>
						<Button text="Survey" minimal={true} rightIcon="caret-down" />
					</Popover>

					{isPermissionGranted(Permission.Admin) && (
						<>
							<Navbar.Divider />

							<Link to="/users">
								<Button
									text="Users"
									minimal={true}
								/>
							</Link>
						</>
					)}

				</Navbar.Group>

				<Navbar.Group align={Alignment.RIGHT}>
					<Popover content={<UserMenu />}>
						<Button
							large
							icon={<Icon icon="user" size={IconSize.LARGE} />}
							rightIcon="caret-down"
							minimal={true}
							text={renderUserName(user)}
						/>
					</Popover>
				</Navbar.Group>
			</Navbar>
		</>
	);
}
