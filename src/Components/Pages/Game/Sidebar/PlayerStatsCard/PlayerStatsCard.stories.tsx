import {ComponentMeta, ComponentStory} from '@storybook/react';
import {PlayerStatsCard} from './';

export default {
	title: 'Player Stats Card',
	component: PlayerStatsCard,
} as ComponentMeta<typeof PlayerStatsCard>;

const Template: ComponentStory<typeof PlayerStatsCard> = args => (
	<div className="bp4-dark">
		<PlayerStatsCard {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	player: {
		current_points: 123,
		current_stage_id: 123,
		current_stage_name: 'Stage 11',
		hub_id: 123,
		user_name: 'John Doe',
	},
};

export const InvalidData = Template.bind({});
InvalidData.args = {
	player: null
};
