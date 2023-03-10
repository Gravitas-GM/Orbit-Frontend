import { ComponentMeta, ComponentStory } from '@storybook/react';
import { boardMock } from '../../../../../../mocks/Board';
import { UpdatePreviewDialog } from './UpdatePreviewDialog';
import { playerUpdateMock } from '../../../../../../mocks/PlayerUpdate';

export default {
	title: 'Update Preview Dialog',
	component: UpdatePreviewDialog,
	parameters: {
		mockData: [
			{
				url: `${process.env.GAME_STATE_URL}/games/accounts/0/update`,
				method: 'GET',
				status: 200,
				response: playerUpdateMock,
				delay: 1500,
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
	board: boardMock,
	onClose: () => null,
};