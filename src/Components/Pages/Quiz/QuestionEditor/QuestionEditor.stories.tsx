import { ComponentMeta, ComponentStory } from '@storybook/react';
import { QuestionEditorPage } from './';
import { questionTagsMock } from '../../../../mocks/QuestionTags';
import { questions } from '../../../../mocks/Questions';

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
			status: 400,
			response: {
				"error": {
				  "code": "validation_failed",
				  "message": "One or more fields did not pass validation",
				  "context": {
					"failures": {
					  "answer-2": {
						"code": "bd79c0ab-ddba-46cc-a703-a7a4b08de310",
						"path": "answer-2",
						"message": "You must provide at least one valid answer."
					  },
					}
				  }
				}
			  },
			delay: 1500,
		},

		// error case for tag fetching
		// {
		// 	url: `${process.env.QUIZ_URL}/tags`,
		// 	method: 'GET',
		// 	status: 403,
		// 	response: {
		// 		"error": {
		// 		  "code": "access_denied",
		// 		  "message": "Access Denied"
		// 		}
		// 	},
		// 	delay: 1500,
		// }
	],
};



export const EditQuestion = Template.bind({});

EditQuestion.args = {
	match: {
		isExact: false,
		path: '/quiz/questions/:question',
		url: '/quiz/questions/1',
		params: {
			question: '1',
		},
	},
};


EditQuestion.parameters = {
	mockData: [
		// success case for tag fetching
		// {
		// 	url: `${process.env.QUIZ_URL}/tags`,
		// 	method: 'GET',
		// 	status: 200,
		// 	response: questionTagsMock,
		// 	delay: 1500,
		// },

		// success case for question fetching
		// {
		// 	url: `${process.env.QUIZ_URL}/questions/1`,
		// 	method: 'GET',
		// 	status: 200,
		// 	response: questions[0],
		// 	delay: 1500,
		// },


		// error case for question fetching
		{
			url: `${process.env.QUIZ_URL}/questions/1`,
			method: 'GET',
			status: 404,
			response: {
				"error": {
				  "code": "not_found",
				  "message": "Not Found"
				}
			  }
		},

		// error case for tag fetching
		{
			url: `${process.env.QUIZ_URL}/tags`,
			method: 'GET',
			status: 403,
			response: {
				"error": {
				  "code": "access_denied",
				  "message": "Access Denied"
				}
			},
			delay: 1500,

		}
	],
};
