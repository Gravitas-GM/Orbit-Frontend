import '@blueprintjs/core/lib/css/blueprint.css';
import { ContextMockDecorator } from '../src/mocks/Context';

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	backgrounds: {
		default: 'dark',
		values: [
			{
				name: "dark",
				value:  "#333"
			},
			{
				name: "light",
				value:  "#fff"
			}
		]
	},
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};

export const decorators = [ContextMockDecorator];
