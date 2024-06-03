import {ComponentMeta, ComponentStory} from '@storybook/react';
import {GamePlayer} from './GamePlayer';

export default {
	title: 'Game Player',
	component: GamePlayer,
} as ComponentMeta<typeof GamePlayer>;

const Template: ComponentStory<typeof GamePlayer> = args => (
	<div className="bp4-dark">
		<GamePlayer {...args} />
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
