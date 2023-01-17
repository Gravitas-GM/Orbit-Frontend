import { userMock } from './User';
import { Story } from '@storybook/react';
import { UserContext } from '../Session';

export function ContextMockDecorator(Story: Story) {
	return (
		<UserContext.Provider value={userMock}>
			<Story />
		</UserContext.Provider>
	);
}