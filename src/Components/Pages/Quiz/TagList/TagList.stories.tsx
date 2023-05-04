import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TagListPage } from './';

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