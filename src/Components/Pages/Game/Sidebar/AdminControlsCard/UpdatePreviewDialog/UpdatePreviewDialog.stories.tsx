import { ComponentMeta, ComponentStory } from '@storybook/react';
import { boardMock } from '../../../../../../mocks/Board';
import { gameStateMock } from '../../../../../../mocks/GameState';
import { UpdatePreviewDialog } from './';
import { playerUpdateMock } from '../../../../../../mocks/PlayerUpdate';

export default {
	title: 'Update Preview Dialog',
	component: UpdatePreviewDialog,
	parameters: {
		mockData: [
			{
				url: 'http://game.test.api.happyorbit.com/games/accounts/0/update',
				method: 'GET',
				status: 200,
				response: playerUpdateMock,
				delay: 3000,
			},
		],
	},
} as ComponentMeta<typeof UpdatePreviewDialog>;

const Template: ComponentStory<typeof UpdatePreviewDialog> = args => (
	<div className="bp4-dark">
		<UpdatePreviewDialog {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	gameState: gameStateMock,
	board: boardMock,
	onClose: () => null,
};
