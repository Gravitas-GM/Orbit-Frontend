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

					<Button
						icon='bank-account'
						text='Sources'
						minimal={true}
						onClick={() => history.push(`/sources`)}
					/>

					<Button
						icon='properties'
						text='Point Summary'
						minimal={true}
						onClick={() => history.push(`/point-summary`)}
					/>
				</Navbar.Group>

				<Navbar.Group align={Alignment.RIGHT}>
					{user ? (
						<Popover>
							<Button
								text={`Welcome, ${user.firstName}`}
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
