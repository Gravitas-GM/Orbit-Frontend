import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SourcesList } from '.';
import { pointSourceItemsMock } from '../../../mocks/PointSourceItem';
import { userMock } from '../../../mocks/User';


export default {
	title: 'Sources Page',
	component: SourcesList,
	parameters: {
		mockData: [
			{
				url: 'http://points.test.api.happyorbit.com/sources/account/0',
				method: 'GET',
				status: 200,
				response: pointSourceItemsMock,
				delay: 1500,
			},
			{
				url: 'http://points.test.api.happyorbit.com/sources/account/0',
				method: 'POST',
				status: 200,
				response: pointSourceItemsMock[0],
				delay: 1500,
			},
			{
				url: 'http://hub.test.api.happyorbit.com/users',
				method: 'GET',
				status: 200,
				response: [userMock],
				delay: 1500,
			},
			{
				url: 'http://points.test.api.happyorbit.com/points/users/0',
				method: 'PUT',
				status: 200,
				response: [userMock],
				delay: 1500,
			},
			{
				url: 'http://points.test.api.happyorbit.com/sources/0',
				method: 'DELETE',
				status: 200,
				response: pointSourceItemsMock[0],
				delay: 500,
			}
		]
	},
} as ComponentMeta<typeof SourcesList>;

const Template: ComponentStory<typeof SourcesList> = () => <SourcesList />;

export const Basic = Template.bind({});