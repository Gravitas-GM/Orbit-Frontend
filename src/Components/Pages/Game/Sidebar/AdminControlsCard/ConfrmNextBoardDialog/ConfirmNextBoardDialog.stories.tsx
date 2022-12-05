import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ConfirmNextBoardDialog } from './';

export default {
	title: 'Confirm Next Board Dialog',
	component: ConfirmNextBoardDialog,
} as ComponentMeta<typeof ConfirmNextBoardDialog>;

const Template: ComponentStory<typeof ConfirmNextBoardDialog> = args => (
	<div className="bp4-dark">
		<ConfirmNextBoardDialog {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	onClose: () => null,
	moveToNextBoard: () => null
};
