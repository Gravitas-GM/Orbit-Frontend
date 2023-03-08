import { UserPointsSummary } from '../Api/Point-Tracking/Models/Points';

export const userPointsSummaryMock: UserPointsSummary[] = [
	{
		account_id: 0,
		id: 0,
		points: [
			{
				count: 1,
				points: 120,
				source: 'Example Source',
			},
		],
		total_points: 220,
		user_name: 'John Doe',
	},
];
