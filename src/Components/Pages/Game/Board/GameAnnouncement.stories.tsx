import { ComponentMeta, ComponentStory } from '@storybook/react';
import {GameAnnouncement} from './GameAnnouncement';

export default {
	title: 'Game Announcement',
	component: GameAnnouncement,
} as ComponentMeta<typeof GameAnnouncement>;

const Template: ComponentStory<typeof GameAnnouncement> = args => (
	<div className="bp4-dark">
		<GameAnnouncement {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	player: {
		hub_id: 1,
		user_name: 'Frodo Baggins',
		current_stage_id: 1,
		current_stage_name: 'The Shire',
		current_points: 20,
	},
};
