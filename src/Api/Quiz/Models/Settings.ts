export interface SettingsEndpoints {
	// TODO: Add endpoints
}

export interface Settings {
	accountId: number,
	quizFrequency: Frequency,
	questionCount: number,
	completedRewardPointSourceId: string|null,
}

export enum Frequency {
	Daily = 'daily',
	Weekly = 'weekly',
	Monthly = 'monthly',
}
