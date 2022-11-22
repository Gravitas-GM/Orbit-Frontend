import {ComponentMeta, ComponentStory} from '@storybook/react';
import {AdminControlsCard} from './';

export default {
	title: 'Admin Controls Card',
	component: AdminControlsCard,
} as ComponentMeta<typeof AdminControlsCard>;

const Template: ComponentStory<typeof AdminControlsCard> = args => (
	<div className="bp4-dark">
		<AdminControlsCard {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	game: {
		name: 'Game',
		account_id: 'game-account',
		catalog_id: 'game-catalog-id',
		current_board: {
			id: 'board-id',
			name: 'board-name',
			sequence: 3,
		},

		players: [
			{
				current_points: 59,
				current_stage_id: 3,
				current_stage_name: 'Semi Final Stage',
				hub_id: 123,
				user_name: 'John Mayall',
			},
			{
				current_points: 30,
				current_stage_id: 123,
				current_stage_name: 'Stage 11',
				hub_id: 123,
				user_name: 'John John Florence',
			},
			{
				current_points: 23,
				current_stage_id: 123,
				current_stage_name: 'Stage 11',
				hub_id: 123,
				user_name: 'John Mellencamp',
			},
		],
	},

	board: {
		id: 123,
		name: '123',
		sequence: 3,
		game: 1,
		imageUrl: '',
		stages: [
			{
				id: 1,
				name: 'string',
				board: 2,
				requiredPoints: 2,
				boardRegion: {
					x: 10,
					y: 10,
					width: 132,
					height: 120,
				},
			},
		],
	},
};
