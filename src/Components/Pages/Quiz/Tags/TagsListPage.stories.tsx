import {ComponentMeta, ComponentStory} from '@storybook/react';
import {TagListPage} from './';
import {questionTagsMock} from '../../../../mocks/QuestionTags';
import {usersMock} from '../../../../mocks/User';

export default {
	title: 'Quiz - Tag List Page',
	component: TagListPage,
} as ComponentMeta<typeof TagListPage>;

const Template: ComponentStory<typeof TagListPage> = (args) => (
	<div className="bp4-dark">
		<TagListPage {...args} />
	</div>
);

export const Basic = Template.bind({});

Basic.parameters = {
	mockData: [
		{
			url: `${process.env.HUB_URL}/users`,
			method: 'GET',
			response: usersMock,
			status: 200,
			delay: 1500,
		},
		{
			url: `${process.env.QUIZ_URL}/tags`,
			method: 'GET',
			response: questionTagsMock,
			status: 200,
			delay: 1500,
		},
		{
			url: `${process.env.QUIZ_URL}/tags/1`,
			method: 'DELETE',
			response: {},
			status: 200,
		},
		{
			url: `${process.env.QUIZ_URL}/tags/1`,
			method: 'POST',
			response: {},
			status: 200,
		},
		// error case for submitting tag without label:
		{
			url: `${process.env.QUIZ_URL}/tags`,
			method: 'PUT',
			status: 200,
			response: {},
			delay: 1500,
		},
	],
};

export const NoData = Template.bind({});

NoData.parameters = {
	mockData: [
		{
			url: `${process.env.HUB_URL}/users`,
			method: 'GET',
			response: [],
			status: 200,
			delay: 1500,
		},
		{
			url: `${process.env.QUIZ_URL}/tags`,
			method: 'GET',
			response: [],
			status: 200,
			delay: 1500,
		},
		{
			url: `${process.env.QUIZ_URL}/tags/1`,
			method: 'DELETE',
			response: {},
			status: 200,
		},
		{
			url: `${process.env.QUIZ_URL}/tags/1`,
			method: 'POST',
			response: {},
			status: 200,
		},
		// error case for submitting tag without user:
		{
			url: `${process.env.QUIZ_URL}/tags`,
			method: 'PUT',
			status: 400,
			response: {
				error: {
					code: 'validation_failed',
					message: 'One or more fields did not pass validation',
					context: {
						failures: {
							prompt: {
								code: 'bd79c0ab-ddba-46cc-a703-a7a4b08de310',
								path: 'tag-users',
								message: 'You must provide at least one user for the tag.',
							},
						},
					},
				},
			},
			delay: 1500,
		},
	],
};

export const SubmitError = Template.bind({});

SubmitError.parameters = {
	mockData: [
		{
			url: `${process.env.HUB_URL}/users`,
			method: 'GET',
			response: usersMock,
			status: 200,
			delay: 1500,
		},
		{
			url: `${process.env.QUIZ_URL}/tags`,
			method: 'GET',
			response: questionTagsMock,
			status: 200,
			delay: 1500,
		},
		{
			url: `${process.env.QUIZ_URL}/tags/1`,
			method: 'DELETE',
			response: {},
			status: 200,
		},
		// error case for submitting tag without label:
		{
			url: `${process.env.QUIZ_URL}/tags`,
			method: 'PUT',
			status: 400,
			response: {
				error: {
					code: 'validation_failed',
					message: 'One or more fields did not pass validation',
					context: {
						failures: {
							name: {
								code: 'bd79c0ab-ddba-46cc-a703-a7a4b08de310',
								path: 'name',
								message: 'You must provide a valid name for the tag.',
							},
						},
					},
				},
			},
			delay: 1500,
		},
	],
};
