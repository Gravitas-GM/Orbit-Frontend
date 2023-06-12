import {ComponentMeta, ComponentStory} from '@storybook/react';
import {StartGameDialog} from './StartGameDialog';

export default {
	title: 'Start Game Dialog',
	component: StartGameDialog,
} as ComponentMeta<typeof StartGameDialog>;

const Template: ComponentStory<typeof StartGameDialog> = args => (
	<div className="bp4-dark">
		<StartGameDialog {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	game: {
		id: 1,
		name: 'Zelda',
		description: 'A collection of Zelda board games.',
		publishedDate: null,
		hidden: false,
		boards: [],
		thumbnailUrl: 'https://images.nintendolife.com/880243a8baed2/switch-tloz-totk-artwork-01.large.jpg',
	},
	isOpen: true,
	onCancel: () => null,
	onConfirm: () => Promise.resolve(),
	processing: false,
};
