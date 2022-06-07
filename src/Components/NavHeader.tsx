import * as React from 'react';
import {
	Alignment,
	Button,
	Icon,
	Intent,
	Menu,
	MenuDivider,
	MenuItem,
	Navbar,
	Popover,
	Spinner,
} from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import './NavHeader.scss';

interface IProps {
	loading: boolean;
}

export const NavHeader: React.FC<IProps> = props => (
	props.loading ? (
		<Spinner intent={Intent.PRIMARY} />
	) : (
		<Navbar id="nav-header" className="bp4-navbar bp4-dark">
			<Navbar.Group align={Alignment.LEFT}>
				<Navbar.Heading>
					<Link to="/" style={{color: 'white', textDecoration: 'none'}}>Happy Orbit</Link>
				</Navbar.Heading>

				<Navbar.Divider />

				<Link to="/users" className="nav-link"><Icon icon={'user'}/> Users</Link>

				<Link to="/sources" className="nav-link"><Icon icon={'bank-account'}/> Sources</Link>

				<Link to="/point-summary" className="nav-link"><Icon icon={'properties'}/> Point Summary</Link>
			</Navbar.Group>

			<Navbar.Group align={Alignment.RIGHT}>
				<Popover>
					<Button text={'Welcome'} rightIcon={'caret-down'} minimal={true} style={{color: 'white'}} />

					<Menu>
						<MenuItem
							text="Settings"
							icon="person"
						/>

						<MenuDivider />

						<MenuItem
							text="Log Out"
							icon="log-out"
						/>
					</Menu>
				</Popover>
			</Navbar.Group>
		</Navbar>
	)
);

NavHeader.displayName = 'NavHeader';
