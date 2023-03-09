import { ComponentMeta, ComponentStory } from '@storybook/react';
import { GameInfoCard } from './GameInfoCard';
import { gameMock } from '../../../mocks/Game';

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
	game: gameMock
};
