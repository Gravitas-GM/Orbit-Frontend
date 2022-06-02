import {Intent, Spinner} from '@blueprintjs/core';
import * as React from 'react';
import {NavHeader} from './NavHeader';

interface IProps {
	loading: boolean;
}

export const Layout: React.FC<IProps> = props => (
	props.loading ? (
		<div style={{width: '100%', height: '100vh'}}>
			<Spinner intent={Intent.PRIMARY} />
		</div>
	) : (
		<div style={{flex: 12}}>
			<NavHeader loading={props.loading} />

			<div className="main-frame">
				{/*TODO: this is where the switch for page content will live /larry*/}
			</div>
		</div>
	)
);

Layout.displayName = 'Layout';
