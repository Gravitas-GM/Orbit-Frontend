import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PointSummary } from '.';
import { userPointsSummaryMock } from '../../../mocks/UserPointSummary';
import { pointSourceItemsMock } from '../../../mocks/PointSourceItem';
import { gameStateMock } from '../../../mocks/GameState';

export default {
	title: 'Point Summary Page',
	component: PointSummary,
};

const Template: ComponentStory<typeof PointSummary> = () => <PointSummary />;

const Basic = Template.bind({});

Basic.parameters = {
	mockData: [
		{
			url: 'http://points.test.api.happyorbit.com/points/account/0/total',
			method: 'GET',
			status: 200,
			response: userPointsSummaryMock,
			delay: 1500,
		},
		{
			url: 'http://points.test.api.happyorbit.com/sources/account/0',
			method: 'GET',
			status: 200,
			response: pointSourceItemsMock,
			delay: 1500,
		},
		{
			url: 'http://game.test.api.happyorbit.com/games/accounts/0',
			method: 'GET',
			status: 200,
			response: gameStateMock,
			delay: 1500,
		},
	],
} as ComponentMeta<typeof PointSummary>;

const NoSources = Template.bind({});

NoSources.parameters = {
		mockData: [
		{
			url: 'http://points.test.api.happyorbit.com/points/account/0/total',
			method: 'GET',
			status: 200,
			response: [],
			delay: 1500,
		},
		{
			url: 'http://points.test.api.happyorbit.com/sources/account/0',
			method: 'GET',
			status: 200,
			response: [],
			delay: 1500,
		},
		{
			url: 'http://game.test.api.happyorbit.com/games/accounts/0',
			method: 'GET',
			status: 200,
			response: gameStateMock,
			delay: 1500,
		},
	],
} as ComponentMeta<typeof PointSummary>;

const NoPointsAssigned = Template.bind({});

NoPointsAssigned.parameters = {
	mockData: [
		{
			url: 'http://points.test.api.happyorbit.com/points/account/0/total',
			method: 'GET',
			status: 200,
			response: [],
			delay: 1500,
		},
		{
			url: 'http://points.test.api.happyorbit.com/sources/account/0',
			method: 'GET',
			status: 200,
			response: pointSourceItemsMock,
			delay: 1500,
		},
		{
			url: 'http://game.test.api.happyorbit.com/games/accounts/0',
			method: 'GET',
			status: 200,
			response: gameStateMock,
			delay: 1500,
		},
	],
} as ComponentMeta<typeof PointSummary>;


export { Basic, NoPointsAssigned, NoSources }
