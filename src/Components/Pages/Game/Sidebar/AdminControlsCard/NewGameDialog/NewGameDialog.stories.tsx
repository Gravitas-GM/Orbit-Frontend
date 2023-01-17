import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NewGameDialog } from './';

export default {
	title: 'New Game Dialog',
	component: NewGameDialog,
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