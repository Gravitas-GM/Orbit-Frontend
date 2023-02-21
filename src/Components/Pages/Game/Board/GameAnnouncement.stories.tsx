import { ComponentMeta, ComponentStory } from '@storybook/react';
import {UpdateResultType} from '../../../../Api/Game-State/Models/Games';
import {GameAnnouncement} from './GameAnnouncement';

export default {
	title: 'Game Announcement',
	component: GameAnnouncement,
} as ComponentMeta<typeof GameAnnouncement>;

const Template: ComponentStory<typeof GameAnnouncement> = args => (
	<div className="bp4-dark">
		<GameAnnouncement {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	player: {
		type: UpdateResultType.MOVED,
		player: {
			hub_id: 1,
			account_id: 1,
			user_name: 'Frodo Baggins',
			current_stage_index: 1,
			current_points: 20,
		},
		new_point_total: 10,
		new_stage: {
			stage: {
				id: 1,
				name: 'The Shire',
				board: 1,
				requiredPoints: 5,
				boardRegion: {
					x: 30,
					y: 50,
					width: 100,
					height: 150,
				},
			},
			index: 1,
		},
		history_item: {
			id: {
				$oid: 'thisisanobjectid',
			},
			account_id: 1,
			timestamp: new Date(),
			content: 'Test History Item',
		},
	},
	stage: {
		id: 1,
		name: 'The Shire',
		board: 1,
		requiredPoints: 5,
		boardRegion: {
			x: 30,
			y: 50,
			width: 100,
			height: 150,
		},
	},
};
