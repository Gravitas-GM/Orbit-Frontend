import { ComponentMeta, ComponentStory } from '@storybook/react';
import { boardMock } from '../../../../../../mocks/Board';
import { gameStateMock } from '../../../../../../mocks/GameState';
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
	gameState: gameStateMock,
	board: boardMock,
	onClose: () => null,
};
