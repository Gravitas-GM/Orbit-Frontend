import * as React from 'react';
import {Button, Intent, Menu, MenuDivider, MenuItem, Popover, Spinner} from '@blueprintjs/core';
import './NavHeader.scss';

interface IProps {
	loading: boolean;
}

export const NavHeader: React.FC<IProps> = props => (
	props.loading ? (
		<Spinner intent={Intent.PRIMARY} />
	) : (
		<div id="nav-header">
			<div style={{flex: 8}}>
				Happy Orbit
			</div>

			<Popover>
				<Button text={'Welcome'} rightIcon={'caret-down'} minimal={true} />

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
