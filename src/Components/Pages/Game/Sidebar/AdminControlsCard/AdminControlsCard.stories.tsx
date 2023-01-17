import {ComponentMeta, ComponentStory} from '@storybook/react';
import {AdminControlsCard} from './';
import { boardMock } from '../../../../../mocks/Board';
import { gameStateMock } from '../../../../../mocks/GameState';

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
	gameState: gameStateMock,
	board: boardMock,
	goToNextBoard: () => Promise.resolve(),
	startNewGame: () => Promise.resolve()
};