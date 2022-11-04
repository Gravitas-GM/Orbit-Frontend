import { ComponentMeta, ComponentStory } from '@storybook/react';
import {GameBoard} from './GameBoard';

export default {
	title: 'Game Board',
	component: GameBoard,
} as ComponentMeta<typeof GameBoard>;

const Template: ComponentStory<typeof GameBoard> = args => (
	<div className="bp4-dark">
		<GameBoard {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	board: {
		id: 1,
		game: 1,
		name: 'Middle Earth',
		sequence: 1,
		imageUrl: 'https://m.media-amazon.com/images/I/91pkSZRMWSL._AC_SL1500_.jpg',
		stages: [
			{
				id: 1,
				name: 'The Shire',
				board: 1,
				requiredPoints: 5,
				boardRegion: {
					x: 150,
					y: 425,
					width: 100,
					height: 150,
				},
			},
			{
				id: 2,
				name: 'Rivendell',
				board: 1,
				requiredPoints: 100,
				boardRegion: {
					x: 600,
					y: 465,
					width: 100,
					height: 150,
				},
			},
			{
				id: 3,
				name: 'Gondor',
				board: 1,
				requiredPoints: 200,
				boardRegion: {
					x: 1150,
					y: 660,
					width: 100,
					height: 150,
				},
			}
		],
	},
	gameState: {
		name: 'The Lord of the Rings',
		account_id: 1,
		catalog_id: 1,
		current_board: {
			id: 1,
			name: 'Middle Earth',
			sequence: 1,
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
			},
			{
				hub_id: 4,
				user_name: 'Gandalf Grey',
				current_stage_id: 2,
				current_stage_name: 'Rivendell',
				current_points: 125,
			},
			{
				hub_id: 5,
				user_name: 'Saruman White',
				current_stage_id: 2,
				current_stage_name: 'Rivendell',
				current_points: 130,
			},
			{
				hub_id: 6,
				user_name: 'Pippin Took',
				current_stage_id: 2,
				current_stage_name: 'Rivendell',
				current_points: 150,
			},
			{
				hub_id: 7,
				user_name: 'Merry Brandybuck',
				current_stage_id: 2,
				current_stage_name: 'Rivendell',
				current_points: 160,
			},
			{
				hub_id: 8,
				user_name: 'Gimli Dwarf',
				current_stage_id: 3,
				current_stage_name: 'Gondor',
				current_points: 230,
			},
			{
				hub_id: 9,
				user_name: 'Legolas Elf',
				current_stage_id: 3,
				current_stage_name: 'Gondor',
				current_points: 250,
			},
		],
	},
};
