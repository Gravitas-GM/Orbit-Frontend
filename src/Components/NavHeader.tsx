import {
	Alignment,
	Button,
	Classes,
	Icon,
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

									<Link to="/" className="plain-link">
										<Button
											icon="home"
											text="Home"
											minimal
										/>
									</Link>

									<Popover>
										<Button
											text="Game"
											icon="properties"
											minimal={true}
										/>
										<Menu>
											<MenuItem
												icon="plus"
												text="Claim Points"
												onClick={toggleShowDialog}
											/>

											<MenuItem
												icon="star"
												text="Game Board"
												onClick={()=> { console.log('hit me')}}
											/>

											<MenuItem
												icon="list"
												text="Leaderboard"
												onClick={()=> { console.log('hit me')}}
											/>

											<Link to="/point-summary" className="plain-link">
												<MenuItem
													icon="properties"
													text="Point Summary"
													tagName="span"
												/>
											</Link>

											<MenuDivider />

											{isGranted(Permission.ADMIN) && (
												<Link to="/sources" className="plain-link">
													<MenuItem
														icon="bank-account"
														text="Sources"
														tagName="span"
													/>
												</Link>
											)}
										</Menu>
									</Popover>

									{isGranted(Permission.ADMIN) && (
										<Link to="/users">
											<Button
												icon="user"
												text="Users"
												minimal={true}
											/>
										</Link>
									)}

								</Navbar.Group>

								<Navbar.Group align={Alignment.RIGHT}>
									{user ? (
										<Popover>
											<Button
												large
												rightIcon={'caret-down'}
												minimal={true}
												className="gm-navbar profile-button"
											>
												<Icon icon="user" size={32} />
												{renderUserName(user)}
											</Button>

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
