import * as React from 'react';
import {Button, Intent, Menu, MenuDivider, MenuItem, Popover, Spinner} from '@blueprintjs/core';
import './NavHeader.scss';
import {Link} from 'react-router-dom';

interface IProps {
	loading: boolean;
}

export const NavHeader: React.FC<IProps> = props => (
	props.loading ? (
		<Spinner intent={Intent.PRIMARY} />
	) : (
		<div id="nav-header">
			<div style={{flex: 8}}>
				<Link to="/" style={{color: 'white', paddingRight: 100}}>
					Happy Orbit
				</Link>

				<Link to="/users" className="nav-link">
					Users
				</Link>

				<Link to="/sources" className="nav-link">
					Sources
				</Link>

				<Link to="/point-summary" className="nav-link">
					Point Summary
				</Link>
			</div>

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
		</div>
	)
);

NavHeader.displayName = 'NavHeader';
