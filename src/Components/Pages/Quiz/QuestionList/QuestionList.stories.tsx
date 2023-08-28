import { ComponentMeta, ComponentStory } from '@storybook/react';
import { QuestionListPage } from './';
import { questions } from '../../../../mocks/Questions';

export default {
	title: 'Quiz - Question List Page',
	component: QuestionListPage,
} as ComponentMeta<typeof QuestionListPage>;

const Template: ComponentStory<typeof QuestionListPage> = args => (
	<div className="bp4-dark">
		<QuestionListPage {...args} />
	</div>
);

export const Basic = Template.bind({});

Basic.parameters = {
	mockData: [
		{
			url: `${process.env.QUIZ_URL}/questions`,
			method: 'GET',
			status: 200,
			response: questions,
			delay: 1500
		}
	]
};

export const NoQuestions = Template.bind({});

NoQuestions.parameters = {
	mockData: [
		{
			url: `${process.env.QUIZ_URL}/questions`,
			method: 'GET',
			status: 200,
			response: [],
			delay: 1500
		}
	]
};
