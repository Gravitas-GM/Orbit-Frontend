module.exports = {
	"stories": [
		"../src/**/*.stories.mdx",
		"../src/**/*.stories.@(js|jsx|ts|tsx)"
	],
	"addons": [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		{
			name: 'storybook-addon-sass-postcss',
			options: {
				rule: {
					test: /\.s[ca]ss$/i,
				},
				sassLoaderOptions: {
					implementation: require('sass'),
				},
			},
		},
	],
	"framework": "@storybook/react"
}
