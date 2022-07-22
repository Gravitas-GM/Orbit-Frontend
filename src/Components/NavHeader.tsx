import {Alignment, Button, Intent, Menu, MenuDivider, MenuItem, Navbar, Popover, Spinner} from '@blueprintjs/core';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {logout} from '../Api';
import {history} from '../history';
import {Permission, PermissionContext} from '../Permission';
import {UserContext} from '../Session';
import './NavHeader.scss';
import {renderUserName} from './Utility/string';

interface IProps {
	loading: boolean;
}

export const NavHeader: React.FC<IProps> = props => (
	<UserContext.Consumer>
		{user => (
			<PermissionContext.Consumer>
				{([isGranted]) => (
					<Navbar id="nav-header" className="bp4-navbar bp4-dark">
						<Navbar.Group align={Alignment.LEFT}>
							<Navbar.Heading>
								<Link to="/" style={{color: 'white', textDecoration: 'none'}}>Happy Orbit</Link>
							</Navbar.Heading>

							<Navbar.Divider />

							{isGranted(Permission.ADMIN) && (
								<Button
									icon="user"
									text="Users"
									minimal={true}
									onClick={() => history.push(`/users`)}
								/>
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
										<MenuItem
											icon="bank-account"
											text="Sources"
											onClick={() => history.push(`/sources`)}
										/>
									)}

									<MenuItem
										icon="properties"
										text="Point Summary"
										onClick={() => history.push(`/point-summary`)}
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
				)}
			</PermissionContext.Consumer>
		)}
	</UserContext.Consumer>
);

NavHeader.displayName = 'NavHeader';
