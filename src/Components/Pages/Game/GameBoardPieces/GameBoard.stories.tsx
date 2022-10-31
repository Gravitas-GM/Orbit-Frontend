import { ComponentMeta, ComponentStory } from '@storybook/react';
import {GameBoard} from './GameBoard';

export default {
	title: 'Game Board',
	component: GameBoard,
} as ComponentMeta<typeof GameBoard>;

const Template: ComponentStory<typeof GameBoard> = args => (
	<div className="bp4-dark">
		<GameBoard {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	imageUrl: 'https://m.media-amazon.com/images/I/91pkSZRMWSL._AC_SL1500_.jpg',
	loading: false,
};
