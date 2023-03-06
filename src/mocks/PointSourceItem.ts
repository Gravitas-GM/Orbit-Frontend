import { PointItemCreatePayload } from '../Api/Point-Tracking/Models/Points';
import { PointSourceItem } from '../Api/Point-Tracking/Models/Sources';

export const pointSourceItemsMock: PointSourceItem[] = [
	{
		id: {
			$oid: '0',
		},
		name: 'Test Source',
		point_value: 123,
	},
];

export const addPointSourceItemRequestMock: PointItemCreatePayload = {
	source: 'Test Source Added',
	point_value: 20,
	timestamp: new Date()
}