import * as React from 'react';
import {
	Alignment,
	Button,
	Intent,
	Menu,
	MenuDivider,
	MenuItem,
	Navbar,
	Popover,
	Spinner,
} from '@blueprintjs/core';
import {Link} from 'react-router-dom';
import './NavHeader.scss';
import {logout} from '../Api';
import {history} from '../history';
import {UserContext} from '../Session';
import {renderUserName} from './Utility/string';

interface IProps {
	loading: boolean;
}

export const NavHeader: React.FC<IProps> = props => (
	<UserContext.Consumer>
		{user => (
			<Navbar id="nav-header" className="bp4-navbar bp4-dark">
				<Navbar.Group align={Alignment.LEFT}>
					<Navbar.Heading>
						<Link to="/" style={{color: 'white', textDecoration: 'none'}}>Happy Orbit</Link>
					</Navbar.Heading>

					<Navbar.Divider />

					<Button
						icon='user'
						text='Users'
						minimal={true}
						onClick={() => history.push(`/users`)}
					/>

					<Popover>
						<Button
							text='Points'
							icon='properties'
							minimal={true}
							style={{color: 'white'}}
						/>

						<Menu>
							<MenuItem
								icon='bank-account'
								text='Sources'
								onClick={() => history.push(`/sources`)}
							/>

							<MenuItem
								icon='properties'
								text='Point Summary'
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
	</UserContext.Consumer>
);

NavHeader.displayName = 'NavHeader';
