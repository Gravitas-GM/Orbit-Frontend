import {ComponentMeta, ComponentStory} from '@storybook/react';
import {TopRankedUsers} from './';

export default {
	title: 'Top Ranked Users Card',
	component: TopRankedUsers,
} as ComponentMeta<typeof TopRankedUsers>;

const Template: ComponentStory<typeof TopRankedUsers> = args => (
	<div className="bp4-dark">
		<TopRankedUsers {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	topUsers: [
		{
			current_points: 123,
			current_stage_id: 123,
			current_stage_name: 'Stage 11',
			hub_id: 123,
			user_name: 'John Doe',
		},
		{
			current_points: 99,
			current_stage_id: 123,
			current_stage_name: 'Stage 11',
			hub_id: 123,
			user_name: 'Robert Johnson',
		},
		{
			current_points: 21,
			current_stage_id: 123,
			current_stage_name: 'Stage 11',
			hub_id: 123,
			user_name: 'Joe Strummer',
		},
	],
};
