import {ComponentMeta, ComponentStory} from '@storybook/react';
import {LogHistoryCard} from './';

export default {
	title: 'Log History Card',
	component: LogHistoryCard,
} as ComponentMeta<typeof LogHistoryCard>;

const Template: ComponentStory<typeof LogHistoryCard> = args => (
	<div className="bp4-dark">
		<LogHistoryCard {...args} />
	</div>
);

export const Basic = Template.bind({});
Basic.args = {
	history: [
		{
			id: {$oid: '3'},
			account_id: 723,
			timestamp: new Date(),
			content: 'John Smith moved from Russia to Japan (250 points)',
		},
		{
			id: {$oid: '2'},
			account_id: 723,
			timestamp: new Date(),
			content: 'Bilbo Baggins moved from Canada to Russia (130 points)',
		},
		{
			id: {$oid: '1'},
			account_id: 923,
			timestamp: new Date(),
			content: 'Betty White moved from Australia to Canada  (130 points)',
		},
		{
			id: {$oid: '31'},
			account_id: 123,
			timestamp: new Date('10/01/2022'),
			content: 'John Smith moved from Russia to Japan (250 points)',
		},
		{
			id: {$oid: '22'},
			account_id: 223,
			timestamp: new Date('10/01/2022'),
			content: 'Bilbo Baggins moved from Canada to Russia (130 points)',
		},
		{
			id: {$oid: '11'},
			account_id: 523,
			timestamp: new Date('10/01/2022'),
			content: 'Betty White moved from Australia to Canada  (130 points)',
		},
	],
};

export const NoData = Template.bind({});
NoData.args = {
	history: [],
};

export const Error = Template.bind({});
Error.args = {
	history: null,
};
