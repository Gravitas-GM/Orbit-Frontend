import {ComponentMeta, ComponentStory} from '@storybook/react';
import {QuizResultsPage} from './';
import {RegularUserContextMockDecorator} from '../../../../mocks/Context';
import {quizSubmissionsMock} from '../../../../mocks/QuizSubmissions';

export default {
	title: 'Quiz Results Page',
	component: QuizResultsPage,
};

const Template: ComponentStory<typeof QuizResultsPage> = (args) => <QuizResultsPage {...args} />;

const Basic = Template.bind({});

const WrongId = Template.bind({});

Basic.decorators = [RegularUserContextMockDecorator];

Basic.args = {
	match: {
		isExact: false,
		path: '/quiz/questions/:question',
		url: '/quiz/questions',
		params: {
			submission: '1',
		},
	},
};

WrongId.args = {
	match: {
		isExact: false,
		path: '/quiz/questions/:question',
		url: '/quiz/questions',
		params: {
			submission: '43',
		},
	},
};

Basic.parameters = {
	mockData: [
		{
			url: `${process.env.QUIZ_URL}/submissions/1`,
			method: 'GET',
			status: 200,
			response: quizSubmissionsMock[0],
			delay: 1500,
		},
	],
} as ComponentMeta<typeof QuizResultsPage>;

export {Basic, WrongId};
