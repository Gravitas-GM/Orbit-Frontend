import { ComponentMeta, ComponentStory } from '@storybook/react';
import {GameStage} from './GameStage';

export default {
	title: 'Game Stage',
	component: GameStage,
} as ComponentMeta<typeof GameStage>;

const Template: ComponentStory<typeof GameStage> = args => (
	<div className="bp4-dark">
		<GameStage {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	stage: {
		id: 1,
		name: 'The Shire',
		board: 1,
		requiredPoints: 5,
		boardRegion: {
			x: 10,
			y: 10,
			width: 50,
			height: 50,
		},
	},
	players: [
		{
			hub_id: 1,
			user_name: 'Frodo Baggins',
			current_stage_id: 1,
			current_stage_name: 'The Shire',
			current_points: 20,
		},
		{
			hub_id: 2,
			user_name: 'Bilbo Baggins',
			current_stage_id: 1,
			current_stage_name: 'The Shire',
			current_points: 25,
		},
		{
			hub_id: 3,
			user_name: 'Samwise Gamgee',
			current_stage_id: 1,
			current_stage_name: 'The Shire',
			current_points: 10,
		}
	],
};
