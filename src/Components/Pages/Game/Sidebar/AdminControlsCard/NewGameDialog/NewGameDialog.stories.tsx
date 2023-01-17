import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NewGameDialog } from './';
import { gameMock } from '../../../../../../mocks/Game';

export default {
	title: 'New Game Dialog',
	component: NewGameDialog,
	parameters: {
		mockData: [
			{
				url: 'http://catalog.test.api.happyorbit.com/games',
				method: 'GET',
				status: 200,
				response: [gameMock],
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
	startNewGame: () => Promise.resolve(),
};