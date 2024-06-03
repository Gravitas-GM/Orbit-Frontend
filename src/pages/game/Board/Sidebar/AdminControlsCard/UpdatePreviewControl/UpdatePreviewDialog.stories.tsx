import {ComponentMeta, ComponentStory} from '@storybook/react';
import {boardMock} from '../../../../../../mocks/Board';
import {UpdatePreviewDialog} from './UpdatePreviewDialog';
import {playerUpdateMock} from '../../../../../../mocks/PlayerUpdate';

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

export const NoData = Template.bind({});

Basic.parameters = {
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

	Basic.args = {
		board: boardMock,
		onClose: () => null,
	};

NoData.parameters = {
	mockData: [
		{
			url: `${process.env.GAME_STATE_URL}/games/accounts/0/update`,
			method: 'GET',
			status: 200,
			response: [],
			delay: 1500,
		},
	],
},

	NoData.args = {
		board: boardMock,
		onClose: () => null,
	};
