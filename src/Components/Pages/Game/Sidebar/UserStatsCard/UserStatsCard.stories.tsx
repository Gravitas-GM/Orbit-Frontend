import {ComponentMeta, ComponentStory} from '@storybook/react';
import {UserStatsCard} from './';

export default {
	title: 'User Card',
	component: UserStatsCard,
} as ComponentMeta<typeof UserStatsCard>;

const Template: ComponentStory<typeof UserStatsCard> = args => (
	<div className="bp4-dark">
		<UserStatsCard {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	user: {
		current_points: 123,
		current_stage_id: 123,
		current_stage_name: 'Stage 11',
		hub_id: 123,
		user_name: 'John Doe',
	},
};
