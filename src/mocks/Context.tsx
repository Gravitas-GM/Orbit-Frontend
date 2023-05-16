import {userMock} from './User';
import {Story} from '@storybook/react';
import {UserContext} from '../Session';
import {MemoryRouter} from 'react-router';

export function ContextMockDecorator(Story: Story) {
	// hard-coded token with unlimited expiration
	const token = '.eyJpYXQiOjE2Nzc3ODAzNjQsImV4cCI6MzIzMjM0MzQyMzIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJ1c2VySWRlbnRpZmllciI6InRlc3RAZXhhbXBsZS5jb20iLCJpZCI6MSwiYWNjb3VudElkIjoxLCJwZXJtaXNzaW9ucyI6WyJhZG1pbiJdfQ.';

	window.localStorage.setItem(
		'api.auth_token',
		token,
	);

	return (
		<div className="bp4-dark">
			<MemoryRouter initialEntries={['/']}>
				<UserContext.Provider value={userMock}>
					<Story />
				</UserContext.Provider>
			</MemoryRouter>
		</div>
	);
}