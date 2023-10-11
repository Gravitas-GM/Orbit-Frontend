import {ComponentMeta, ComponentStory} from '@storybook/react';
import {UsersList} from '.';
import {userMock} from '../../../mocks/User';

export default {
	title: 'Users List Page',
	component: UsersList,
	parameters: {
		mockData: [
			{
				url: `${process.env.HUB_URL}/users`,
				method: 'GET',
				status: 200,
				response: [userMock],
				delay: 1500,
			},
			{
				url: `${process.env.HUB_URL}/users/0`,
				method: 'DELETE',
				status: 200,
				response: userMock,
				delay: 500,
			},
		],
	},
} as ComponentMeta<typeof UsersList>;

const Template: ComponentStory<typeof UsersList> = () => <UsersList />;

export const Basic = Template.bind({});
