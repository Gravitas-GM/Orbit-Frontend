import {ComponentMeta, ComponentStory} from '@storybook/react';
import { QuizHistoryPage } from './';
import { RegularUserContextMockDecorator } from '../../../../mocks/Context';
import { usersMock } from '../../../../mocks/User';
import { quizSubmissionsMock } from '../../../../mocks/QuizSubmissions';

export default {
	title: 'Quiz History Page',
	component: QuizHistoryPage,
};

const Template: ComponentStory<typeof QuizHistoryPage> = () => <QuizHistoryPage />;

const AdminUser = Template.bind({});

const NoData = Template.bind({});
const Basic = Template.bind({});

Basic.decorators = [
	RegularUserContextMockDecorator
]

AdminUser.parameters = {
	mockData: [
		{
			url: `${process.env.HUB_URL}/users`,
			method: 'GET',
			status: 200,
			response: usersMock,
			delay: 1500,
		},
		{
			url: `${process.env.QUIZ_URL}/submissions`,
			method: 'GET',
			status: 200,
			response: quizSubmissionsMock,
			delay: 1500,
		},
	],
} as ComponentMeta<typeof QuizHistoryPage>;


Basic.parameters = {
	mockData: [
		{
			url: `${process.env.QUIZ_URL}/submissions`,
			method: 'GET',
			status: 200,
			response: [quizSubmissionsMock[1]],
			delay: 1500,
		},
	],
} as ComponentMeta<typeof QuizHistoryPage>;


NoData.parameters = {
	mockData: [
		{
			url: `${process.env.HUB_URL}/users`,
			method: 'GET',
			status: 200,
			response: [],
			delay: 1500,
		},
		{
			url: `${process.env.QUIZ_URL}/submissions`,
			method: 'GET',
			status: 200,
			response: [],
			delay: 1500,
		},
	],
} as ComponentMeta<typeof QuizHistoryPage>;

export {AdminUser, Basic, NoData};
