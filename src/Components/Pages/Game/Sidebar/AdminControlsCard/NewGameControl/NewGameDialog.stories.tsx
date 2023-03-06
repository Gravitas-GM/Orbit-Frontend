import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NewGameDialog } from './';
import { gamesMock } from '../../../../../../mocks/Game';

export default {
	title: 'New Game Dialog',
	component: NewGameDialog,
	parameters: {
		mockData: [
			{
				url: `${process.env.GAME_CATALOG_URL}/games`,
				method: 'GET',
				status: 200,
				response: gamesMock,
				delay: 1500,
			},
		],
	},
} as ComponentMeta<typeof NewGameDialog>;

const Template: ComponentStory<typeof NewGameDialog> = args => (
	<div className="bp4-dark">
		<NewGameDialog {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	onClose: () => null,
	onConfirm: () => Promise.resolve(),
};