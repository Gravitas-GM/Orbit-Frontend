import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CatalogListPage } from './';
import { gameCatalogMock } from '../../../mocks/GameCatalog';

export default {
	title: 'Catalog List Page',
	component: CatalogListPage,
	parameters: {
        mockData: [
            {
                url: 'https://catalog.api.happyorbit.com/games',
                method: 'GET',
                status: 200,
                response: gameCatalogMock,
				delay: 3000,
            },
        ],
	}
} as ComponentMeta<typeof CatalogListPage>;

const Template: ComponentStory<typeof CatalogListPage> = () =>	<CatalogListPage />;

export const Basic = Template.bind({});
