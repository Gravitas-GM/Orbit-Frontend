import {ComponentMeta, ComponentStory} from '@storybook/react';
import {GameCard} from './GameCard';

export default {
	title: 'Game Card',
	component: GameCard,
} as ComponentMeta<typeof GameCard>;

const Template: ComponentStory<typeof GameCard> = args => (
	<div className="bp4-dark">
		<GameCard {...args}>
			This is the card's content.

			<ul>
				<li>Item #1</li>
				<li>Item #2</li>
				<li>Item #3</li>
				<li>Item #4</li>
				<li>Item #5</li>
				<li>Item #6</li>
				<li>Item #7</li>
				<li>Item #8</li>
			</ul>
		</GameCard>
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	title: 'Card Title',
	icon: 'star',
	fill: false,
};
