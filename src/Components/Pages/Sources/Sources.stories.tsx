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
				url: `${process.env.POINT_TRACKING_URL}/sources/account/0`,
				method: 'GET',
				status: 200,
				response: pointSourceItemsMock,
				delay: 1500,
			},
			{
				url: `${process.env.POINT_TRACKING_URL}/sources/account/0`,
				method: 'POST',
				status: 200,
				response: pointSourceItemsMock[0],
				delay: 1500,
			},
			{
				url: `${process.env.HUB_URL}/users`,
				method: 'GET',
				status: 200,
				response: [userMock],
				delay: 1500,
			},
			{
				url: `${process.env.POINT_TRACKING_URL}/points/users/0`,
				method: 'PUT',
				status: 200,
				response: [userMock],
				delay: 1500,
			},
			{
				url: `${process.env.POINT_TRACKING_URL}/sources/0`,
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