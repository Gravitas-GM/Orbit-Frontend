import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BoardInfoCard } from './BoardInfoCard';

export default {
	title: 'Board Info Card',
	component: BoardInfoCard,
} as ComponentMeta<typeof BoardInfoCard>;

const Template: ComponentStory<typeof BoardInfoCard> = args => (
	<div className="bp4-dark">
		<BoardInfoCard {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	board: {
		id: 1,
		game: 1,
		name: 'Majora\'s Mask',
		sequence: 1,
		imageUrl: 'https://tinyurl.com/5ff4pkf5',
		stages: [
			{
				id: 1,
				name: 'Clock Town',
				board: 1,
				requiredPoints: 5,
				boardRegion: {
					x: 150,
					y: 365,
					width: 100,
					height: 150,
				},
			},
			{
				id: 2,
				name: 'Termina Field',
				board: 1,
				requiredPoints: 100,
				boardRegion: {
					x: 600,
					y: 405,
					width: 100,
					height: 150,
				},
			},
			{
				id: 3,
				name: 'Woodfall',
				board: 1,
				requiredPoints: 200,
				boardRegion: {
					x: 1150,
					y: 600,
					width: 100,
					height: 150,
				},
			}
		],
	},
};
