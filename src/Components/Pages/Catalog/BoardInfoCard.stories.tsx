import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BoardInfoCard } from './BoardInfoCard';
import { catalogGameBoardMock } from '../../../mocks/GameBoard';

export default {
	title: 'Board Info Card',
	component: BoardInfoCard,
} as ComponentMeta<typeof BoardInfoCard>;

const Template: ComponentStory<typeof BoardInfoCard> = args => (
	<div className="bp4-dark">
		<BoardInfoCard {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	board: catalogGameBoardMock
};
