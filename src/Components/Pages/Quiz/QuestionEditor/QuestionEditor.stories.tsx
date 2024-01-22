import {ComponentMeta, ComponentStory} from '@storybook/react';
import {QuestionEditorPage} from './';
import {questionTagsMock} from '../../../../mocks/QuestionTags';
import {questions} from '../../../../mocks/Questions';

export default {
	title: 'Quiz - Question Editor Page',
	component: QuestionEditorPage,
} as ComponentMeta<typeof QuestionEditorPage>;

const Template: ComponentStory<typeof QuestionEditorPage> = args => (
	<div className="bp4-dark">
		<QuestionEditorPage {...args} />
	</div>
);

export const NewQuestion = Template.bind({});

NewQuestion.args = {
	match: {
		isExact: false,
		path: '/quiz/questions/:question',
		url: '/quiz/questions',
		params: {
			question: '',
		},
	},
};

NewQuestion.parameters = {
	mockData: [
		// success case for tag fetching
		{
			url: `${process.env.QUIZ_URL}/tags`,
			method: 'GET',
			status: 200,
			response: questionTagsMock,
			delay: 1500,
		},

		// error case for submitting question without prompt:
		{
			url: `${process.env.QUIZ_URL}/questions`,
			method: 'PUT',
			status: 200,
			response: questions[0],
			delay: 1500,
		},
	],
};

export const ValidationError = Template.bind({});

ValidationError.args = {
	match: {
		isExact: false,
		path: '/quiz/questions/:question',
		url: '/quiz/questions',
		params: {
			question: '',
		},
	},
};

ValidationError.parameters = {
	mockData: [
		// success case for tag fetching
		{
			url: `${process.env.QUIZ_URL}/tags`,
			method: 'GET',
			status: 200,
			response: questionTagsMock,
			delay: 1500,
		},

		// error case for submitting question without prompt:
		{
			url: `${process.env.QUIZ_URL}/questions`,
			method: 'PUT',
			status: 400,
			response: {
				'error': {
					'code': 'validation_failed',
					'message': 'One or more fields did not pass validation',
					'context': {
						'failures': {
							'prompt': {
								'code': 'bd79c0ab-ddba-46cc-a703-a7a4b08de310',
								'path': 'prompt',
								'message': 'You must provide a valid prompt.',
							},
						},
					},
				},
			},
			delay: 1500,
		},
	],
};

export const EditMultipleChoice = Template.bind({});

EditMultipleChoice.args = {
	match: {
		isExact: false,
		path: '/quiz/questions/:question',
		url: '/quiz/questions/1',
		params: {
			question: '1',
		},
	},
};

EditMultipleChoice.parameters = {
	mockData: [
		// success case for tag fetching
		{
			url: `${process.env.QUIZ_URL}/tags`,
			method: 'GET',
			status: 200,
			response: questionTagsMock,
			delay: 1500,
		},

		// success case for question fetching
		{
			url: `${process.env.QUIZ_URL}/questions/1`,
			method: 'GET',
			status: 200,
			response: questions[2],
			delay: 1500,
		},
	],
};

export const EditFreeText = Template.bind({});

EditFreeText.args = {
	match: {
		isExact: false,
		path: '/quiz/questions/:question',
		url: '/quiz/questions/1',
		params: {
			question: '1',
		},
	},
};

EditFreeText.parameters = {
	mockData: [
		// success case for tag fetching
		{
			url: `${process.env.QUIZ_URL}/tags`,
			method: 'GET',
			status: 200,
			response: questionTagsMock,
			delay: 1500,
		},

		// success case for question fetching
		{
			url: `${process.env.QUIZ_URL}/questions/1`,
			method: 'GET',
			status: 200,
			response: questions[0],
			delay: 1500,
		},
	],
};

export const EditBoolean = Template.bind({});

EditBoolean.args = {
	match: {
		isExact: false,
		path: '/quiz/questions/:question',
		url: '/quiz/questions/1',
		params: {
			question: '1',
		},
	},
};

EditBoolean.parameters = {
	mockData: [
		// success case for tag fetching
		{
			url: `${process.env.QUIZ_URL}/tags`,
			method: 'GET',
			status: 200,
			response: questionTagsMock,
			delay: 1500,
		},

		// success case for question fetching
		{
			url: `${process.env.QUIZ_URL}/questions/1`,
			method: 'GET',
			status: 200,
			response: questions[1],
			delay: 1500,
		},
	],
};

export const NoTags = Template.bind({});

NoTags.args = {
	match: {
		isExact: false,
		path: '/quiz/questions/:question',
		url: '/quiz/questions',
		params: {
			question: '',
		},
	},
};

NoTags.parameters = {
	mockData: [
		// success case for tag fetching, but no data
		{
			url: `${process.env.QUIZ_URL}/tags`,
			method: 'GET',
			status: 200,
			response: [],
			delay: 1500,
		},
	],
};
