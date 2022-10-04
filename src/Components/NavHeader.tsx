import {
	Alignment,
	Button,
	Classes,
	Intent,
	Menu,
	MenuDivider,
	MenuItem,
	Navbar,
	Popover,
	Spinner,
} from '@blueprintjs/core';
import {useCallback} from 'react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {logout} from '../Api';
import {Permission, PermissionContext} from '../Permission';
import {UserContext} from '../Session';
import './NavHeader.scss';
import {UserClaimPointsDialog} from './Pages/UserClaimPointsDialog';
import {renderUserName} from './Utility/string';

interface IProps {
	loading: boolean;
}

export const NavHeader: React.FC<IProps> = props => {
	let [showDialog, setShowDialog] = React.useState(false);

	const toggleShowDialog = useCallback(() => setShowDialog(show => !show), []);

	return (
		<UserContext.Consumer>
			{user => (
				<PermissionContext.Consumer>
					{([isGranted]) => (
						<>
							<Navbar id="nav-header" className={Classes.NAVBAR}>
								<Navbar.Group align={Alignment.LEFT}>
									<Navbar.Heading>
										<Link to="/" className="plain-link">Happy Orbit</Link>
									</Navbar.Heading>

									<Navbar.Divider />

									{isGranted(Permission.ADMIN) && (
										<Link to="/users">
											<Button
												icon="user"
												text="Users"
												minimal={true}
											/>
										</Link>
									)}

									<Popover>
										<Button
											text="Points"
											icon="properties"
											minimal={true}
											style={{color: 'white'}}
										/>

										<Menu>
											{isGranted(Permission.ADMIN) && (
												<Link to="/sources" className="plain-link">
													<MenuItem
														icon="bank-account"
														text="Sources"
													/>
												</Link>
											)}

											<Link to="/point-summary" className="plain-link">
												<MenuItem
													icon="properties"
													text="Point Summary"
												/>
											</Link>

											<MenuItem
												icon="plus"
												text="Claim Points"
												onClick={toggleShowDialog}
											/>
										</Menu>
									</Popover>
								</Navbar.Group>

								<Navbar.Group align={Alignment.RIGHT}>
									{user ? (
										<Popover>
											<Button
												text={`Welcome, ${renderUserName(user)}`}
												rightIcon={'caret-down'}
												minimal={true}
												style={{color: 'white'}}
											/>

											<Menu>
												<MenuItem
													text="Settings"
													icon="person"
												/>

												<MenuDivider />

												<MenuItem
													text="Log Out"
													icon="log-out"
													onClick={logout}
												/>
											</Menu>
										</Popover>
									) : <Spinner size={20} intent={Intent.PRIMARY} />}
								</Navbar.Group>
							</Navbar>

							<UserClaimPointsDialog onClose={toggleShowDialog} isOpen={showDialog} />
						</>
					)}
				</PermissionContext.Consumer>
			)}
		</UserContext.Consumer>
	);
};

NavHeader.displayName = 'NavHeader';
