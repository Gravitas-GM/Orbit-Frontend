import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AccountSettings } from '.';
import { pointSourceItemsMock } from '../../../../mocks/PointSourceItem';
import { Frequency } from '../../../../Api/Quiz/Models/Accounts';

export default {
	title: 'Quiz Account Settings',
	component: AccountSettings,
};

const Template: ComponentStory<typeof AccountSettings> = () => <AccountSettings />;

const Basic = Template.bind({});


Basic.parameters = {
	mockData: [
		{
			url: 'http://quiz.test.api.happyorbit.com/settings/0',
			method: 'GET',
			status: 200,
			response: {
				accountId: 0,
				quizFrequency: Frequency.Weekly,
				questionCount: 10,
				completedRewardPointSourceId: 2,
			},
			delay: 1500,
		},
		{
			url: 'http://points.test.api.happyorbit.com/sources/account/0',
			method: 'GET',
			status: 200,
			response: pointSourceItemsMock,
			delay: 1500,
		},
	],
} as ComponentMeta<typeof AccountSettings>;

const NoData = Template.bind({});


NoData.parameters = {
	mockData: [
		{
			url: 'http://quiz.test.api.happyorbit.com/settings/0',
			method: 'GET',
			status: 200,
			response: {},
			delay: 1500,
		},
		{
			url: 'http://points.test.api.happyorbit.com/sources/account/0',
			method: 'GET',
			status: 200,
			response: pointSourceItemsMock,
			delay: 1500,
		},
	],
} as ComponentMeta<typeof AccountSettings>;


export { Basic, NoData };
