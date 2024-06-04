export const Config = {
	api: {
		point_tracking_url: process.env.POINT_TRACKING_URL ?? 'https://points.api.happyorbit.com',
		game_state_url: process.env.GAME_STATE_URL ?? 'https://game.api.happyorbit.com',
		hub_url: process.env.HUB_URL ?? 'https://hub.api.happyorbit.com',
		game_catalog_url: process.env.GAME_CATALOG_URL ?? 'https://catalog.api.happyorbit.com',
		quiz_url: process.env.QUIZ_URL ?? 'https://quiz.api.happyorbit.com',
		survey_url: process.env.SURVEY_URL ?? 'https://survey.api.happyorbit.com',
	},
	isDev: process.env.NODE_ENV === 'development'
};
