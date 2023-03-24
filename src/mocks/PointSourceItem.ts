import { PointItemCreatePayload } from '../Api/Point-Tracking/Models/Points';
import { PointSourceItem } from '../Api/Point-Tracking/Models/Sources';

export const pointSourceItemsMock: PointSourceItem[] = [
	{
		id: {
			$oid: '0',
		},
		name: 'Example Source',
		point_value: 120,
	},
	{
		id: {
			$oid: '2',
		},
		name: 'Another Source',
		point_value: 20,
	},
];

export const addPointSourceItemRequestMock: PointItemCreatePayload = {
	source: 'Another Example Source Added',
	point_value: 120,
	timestamp: new Date()
}
