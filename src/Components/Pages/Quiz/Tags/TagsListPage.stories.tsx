import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TagListPage } from './';
import { usersMock } from '../../../../mocks/User';

export default {
	title: 'Quiz - Tag List Page',
	component: TagListPage,
} as ComponentMeta<typeof TagListPage>;

const Template: ComponentStory<typeof TagListPage> = args => (
	<div className="bp4-dark">
		<TagListPage {...args} />
	</div>
);

export const Basic = Template.bind({});

Basic.parameters = {
	mockData:[
		{
			url: 'http://hub.test.api.happyorbit.com/users',
			method: 'GET',
			response: usersMock,
			status: 200,
			delay: 1500
		}
	]
}