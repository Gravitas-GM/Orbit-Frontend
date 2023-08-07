import { ComponentMeta, ComponentStory } from '@storybook/react';
import { QuestionListPage } from './';

export default {
	title: 'Quiz - Question List Page',
	component: QuestionListPage,
} as ComponentMeta<typeof QuestionListPage>;

const Template: ComponentStory<typeof QuestionListPage> = args => (
	<div className="bp4-dark">
		<QuestionListPage {...args} />
	</div>
);

// TODO: Mock Request

export const Basic = Template.bind({});