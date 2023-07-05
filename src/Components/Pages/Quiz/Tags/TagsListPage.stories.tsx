import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TagListPage } from './';
import { questionTagsMock } from '../../../../mocks/QuestionTags';
import { quizUsers } from '../../../../mocks/QuizUser';

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
			url: 'http://quiz.test.api.happyorbit.com/users',
			method: 'GET',
			response: quizUsers,
			status: 200,
			delay: 1500
		},
		{
			url: 'http://quiz.test.api.happyorbit.com/tags',
			method: 'GET',
			response: questionTagsMock,
			status: 200,
			delay: 1500
		},
		{
			url: 'http://quiz.test.api.happyorbit.com/tags/1',
			method: 'DELETE',
			response: {},
			status: 200,
		}
	]
}