import { ComponentMeta, ComponentStory } from '@storybook/react';
import { GameInfoCard } from './GameInfoCard';

export default {
	title: 'Game Info Card',
	component: GameInfoCard,
} as ComponentMeta<typeof GameInfoCard>;

const Template: ComponentStory<typeof GameInfoCard> = args => (
	<div className="bp4-dark">
		<GameInfoCard {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	game: {
		id: 1,
		name: 'Zelda',
		description: 'A collection of Zelda board games.',
		publishedDate: null,
		hidden: false,
		boards: [],
		thumbnailUrl: 'https://images.nintendolife.com/880243a8baed2/switch-tloz-totk-artwork-01.large.jpg',
	}
};
