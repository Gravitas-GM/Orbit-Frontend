import * as React from 'react';
import {Alignment, Button, Classes, Icon, IconSize, Intent, Navbar, Spinner} from '@blueprintjs/core';
import {Popover2 as Popover} from '@blueprintjs/popover2';
import {Link} from 'react-router-dom';
import {Permission, PermissionContext} from '../../Permission';
import {UserContext} from '../../Session';
import {UserClaimPointsDialog} from '../Pages/UserClaimPointsDialog';
import {renderUserName} from '../Utility/string';
import {GameMenu} from './GameMenu';
import {QuizMenu} from './QuizMenu';
import {UserMenu} from './UserMenu';
import './index.scss';

export const NavHeader: React.FC = () => {
	const user = React.useContext(UserContext);
	const [isGranted] = React.useContext(PermissionContext);
	const [showDialog, setShowDialog] = React.useState(false);

	const onDialogOpen = React.useCallback(() => setShowDialog(true), []);
	const onDialogClose = React.useCallback(() => setShowDialog(false), []);

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

					<Button
						icon="plus"
						text="Claim Points"
						minimal={true}
						onClick={onDialogOpen}
					/>

					{isGranted(Permission.ADMIN) && (
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
					{user ? (
						<Popover content={<UserMenu />}>
							<Button
								large
								icon={<Icon icon="user" size={IconSize.LARGE} />}
								rightIcon="caret-down"
								minimal={true}
								text={renderUserName(user)}
							/>
						</Popover>
					) : <Spinner size={20} intent={Intent.PRIMARY} />}
				</Navbar.Group>
			</Navbar>

			<UserClaimPointsDialog onClose={onDialogClose} isOpen={showDialog} />
		</>
	);
};

NavHeader.displayName = 'NavHeader';
