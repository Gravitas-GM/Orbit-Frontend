import { ComponentMeta, ComponentStory } from '@storybook/react';
import { UpdatePreviewDialog } from './';

export default {
	title: 'Update Preview Dialog',
	component: UpdatePreviewDialog,
} as ComponentMeta<typeof UpdatePreviewDialog>;

const Template: ComponentStory<typeof UpdatePreviewDialog> = args => (
	<div className="bp4-dark">
		<UpdatePreviewDialog {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	gameState: {
		name: 'Game',
		account_id: 123,
		catalog_id: 456,
		current_board: {
			id: 'board-id',
			name: 'board-name',
			sequence: 3,
		},

		players: [
			{
				current_points: 59,
				current_stage_id: 2,
				current_stage_name: 'Semi Final Stage',
				hub_id: 3333,
				user_name: 'John Mayall',
			},
			{
				current_points: 30,
				current_stage_id: 1,
				current_stage_name: 'Start',
				hub_id: 2222,
				user_name: 'John John Florence',
			},
			{
				current_points: 23,
				current_stage_id: 1,
				current_stage_name: 'Start',
				hub_id: 1111,
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
				name: 'Start',
				board: 123,
				requiredPoints: 0,
				boardRegion: {
					x: 10,
					y: 10,
					width: 132,
					height: 120,
				},
			},
			{
				id: 2,
				name: 'Semi final stage',
				board: 123,
				requiredPoints: 23,
				boardRegion: {
					x: 10,
					y: 10,
					width: 132,
					height: 120,
				},
			},
			{
				id: 3,
				name: 'Final stage',
				board: 123,
				requiredPoints: 94,
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

export const NonNullUpdateData = Template.bind({});
NonNullUpdateData.args = {
	gameState: {
		name: 'Game',
		account_id: 123,
		catalog_id: 456,
		current_board: {
			id: 'board-id',
			name: 'board-name',
			sequence: 3,
		},

		players: [
			{
				current_points: 59,
				current_stage_id: 2,
				current_stage_name: 'Semi Final Stage',
				hub_id: 3333,
				user_name: 'John Mayall',
			},
			{
				current_points: 30,
				current_stage_id: 1,
				current_stage_name: 'Start',
				hub_id: 2222,
				user_name: 'John John Florence',
			},
			{
				current_points: 23,
				current_stage_id: 1,
				current_stage_name: 'Start',
				hub_id: 1111,
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
				name: 'Start',
				board: 123,
				requiredPoints: 0,
				boardRegion: {
					x: 10,
					y: 10,
					width: 132,
					height: 120,
				},
			},
			{
				id: 2,
				name: 'Semi final stage',
				board: 123,
				requiredPoints: 23,
				boardRegion: {
					x: 10,
					y: 10,
					width: 132,
					height: 120,
				},
			},
			{
				id: 3,
				name: 'Final stage',
				board: 123,
				requiredPoints: 94,
				boardRegion: {
					x: 10,
					y: 10,
					width: 132,
					height: 120,
				},
			},
		],
	}
};
