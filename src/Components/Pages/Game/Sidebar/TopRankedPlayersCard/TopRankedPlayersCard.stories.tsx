import {ComponentMeta, ComponentStory} from '@storybook/react';
import {TopRankedPlayersCard} from './';

export default {
	title: 'Top Ranked _Users Card',
	component: TopRankedPlayersCard,
} as ComponentMeta<typeof TopRankedPlayersCard>;

const Template: ComponentStory<typeof TopRankedPlayersCard> = args => (
	<div className="bp4-dark">
		<TopRankedPlayersCard {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	players: [
		{
			current_points: 123,
			current_stage_id: 123,
			current_stage_name: 'Stage 11',
			hub_id: 123,
			user_name: 'John Doe',
		},
		{
			current_points: 999,
			current_stage_id: 123,
			current_stage_name: 'Stage 11',
			hub_id: 123,
			user_name: 'Robert Johnson',
		},
		{
			current_points: 321,
			current_stage_id: 123,
			current_stage_name: 'Stage 11',
			hub_id: 123,
			user_name: 'Joe Strummer',
		},
	],
};

export const LessThanThree = Template.bind({});
LessThanThree.args = {
	players: [
		{
			current_points: 123,
			current_stage_id: 123,
			current_stage_name: 'Stage 11',
			hub_id: 123,
			user_name: 'John Doe',
		},
		{
			current_points: 999,
			current_stage_id: 123,
			current_stage_name: 'Stage 11',
			hub_id: 123,
			user_name: 'Robert Johnson',
		},
	],
};

export const EmptyData = Template.bind({});
EmptyData.args = {
	players: [],
};

export const InvalidData = Template.bind({});
InvalidData.args = {
	players: null,
};
