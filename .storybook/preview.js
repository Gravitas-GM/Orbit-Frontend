import '@blueprintjs/core/lib/css/blueprint.css';
import { ContextMockDecorator } from '../src/mocks/Context';

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};

export const decorators = [ContextMockDecorator];
