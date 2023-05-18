import { ComponentMeta, ComponentStory } from '@storybook/react';
import { QuestionEditorPage } from './';

export default {
	title: 'Quiz - Question Editor Page',
	component: QuestionEditorPage,
} as ComponentMeta<typeof QuestionEditorPage>;

const Template: ComponentStory<typeof QuestionEditorPage> = args => (
	<div className="bp4-dark">
		<QuestionEditorPage {...args} />
	</div>
);

export const Basic = Template.bind({});