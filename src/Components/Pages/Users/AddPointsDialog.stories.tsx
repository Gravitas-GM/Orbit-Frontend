import {ComponentMeta, ComponentStory} from '@storybook/react';
import { AddPointsDialog } from './AddPointsDialog';
import { pointSourceItemsMock } from '../../../mocks/PointSourceItem';
export default {
	title: 'Add Points Dialog',
	component: AddPointsDialog,
} as ComponentMeta<typeof AddPointsDialog>;

const Template: ComponentStory<typeof AddPointsDialog> = args => (
	<div className="bp4-dark">
		<AddPointsDialog {...args} />
	</div>
);

export const Basic = Template.bind({});

Basic.args = {
	sources: pointSourceItemsMock,
	processing: false,
	onClose: () => null,
	onSubmit: () => null,
};