import * as React from 'react';
import {User, UserModel} from '../Api/Hub/Models/Users';
import {Token} from '../Api/jwt';
import {isPermissionGranted, MatchQuery, Permission} from '../Api/permissions';
import {isRoleGranted, Role} from '../Api/roles';
import {toaster} from '../toaster';
import {ManagerProps} from './index';
import {LoadingContextValue, useGlobalLoading} from './LoadingContext';
import {State as TokenState, useToken} from './TokenContext';

type RoleCheckFn = (role: Role) => boolean;
type PermissionCheckFn = (match: MatchQuery) => boolean;

export interface Session {
	user: User,
	isRoleGranted: RoleCheckFn,
	isPermissionGranted: PermissionCheckFn,
}

export const SessionContext = React.createContext<Session | null>(null);

export function useSession(): Session | null {
	return React.useContext(SessionContext);
}

export function usePermissions(): PermissionCheckFn {
	const {isPermissionGranted} = useSession() ?? {};
	return isPermissionGranted ?? (() => false);
}

export function useFirewallRoles(): RoleCheckFn {
	const {isRoleGranted} = useSession() ?? {};
	return isRoleGranted ?? (() => false);
}

export function useAppUser(): User | null {
	const session = useSession();
	return session?.user ?? null;
}

export function SessionManager({children}: ManagerProps): React.ReactElement {
	const tokenState = useToken();
	const loadingState = useGlobalLoading();

	return <SessionManagerInner tokenState={tokenState} loadingState={loadingState} children={children} />;
}

interface Props extends ManagerProps {
	tokenState: TokenState,
	loadingState: LoadingContextValue,
}

interface State {
	session: Session | null,
	roles: Set<Role>,
	permissions: Set<Permission>,
}

class SessionManagerInner extends React.PureComponent<Props, State> {
	public state: Readonly<State> = {
		session: null,
		roles: new Set(),
		permissions: new Set(),
	};

	public async componentDidMount(): Promise<void> {
		if (this.props.tokenState.token)
			await this.update(this.props.tokenState.token);
	}

	public async componentDidUpdate(prevProps: Readonly<Props>): Promise<void> {
		if (this.props.tokenState === prevProps.tokenState)
			return;

		if (this.props.tokenState.token === null)
			this.clearSession();
		else
			await this.update(this.props.tokenState.token);
	}

	public render(): React.ReactElement {
		return (
			<SessionContext.Provider value={this.state.session}>
				{this.props.children}
			</SessionContext.Provider>
		);
	}

	private update = async (token: Token) => {
		if (this.props.loadingState.loading)
			return;

		this.props.loadingState.setLoading(true);

		this.setState({
			roles: new Set(token.body.roles),
		});

		let user: User;

		try {
			user = await UserModel.read(token.body.id).then(r => r.data);
		} catch (error) {
			toaster.error('There was a problem retrieving your account information.');
			this.clearSession();

			throw error;
		} finally {
			this.props.loadingState.setLoading(false);
		}

		this.setState({
			permissions: new Set(user.permissions),
			session: {
				user,
				isRoleGranted: this.isRoleGranted,
				isPermissionGranted: this.isPermissionGranted,
			},
		});
	};

	private clearSession = () => this.setState({
		session: null,
		roles: new Set(),
		permissions: new Set(),
	});

	private isRoleGranted: RoleCheckFn = role => isRoleGranted(this.state.roles, role);

	private isPermissionGranted: PermissionCheckFn = match => isPermissionGranted(this.state.permissions, match);
}
