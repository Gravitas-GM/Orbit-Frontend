import {ComponentMeta, ComponentStory} from '@storybook/react';
import {TopRankedPlayers} from './';

export default {
	title: 'Top Ranked Users Card',
	component: TopRankedPlayers,
} as ComponentMeta<typeof TopRankedPlayers>;

const Template: ComponentStory<typeof TopRankedPlayers> = args => (
	<div className="bp4-dark">
		<TopRankedPlayers {...args} />
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
