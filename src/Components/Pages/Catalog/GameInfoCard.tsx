import * as React from 'react';
import { Card, H2 } from '@blueprintjs/core';
import { Game } from '../../../Api/Game-Catalog/Models/Games';
import { ucwords } from '../../Utility/string';
import './CatalogInfoCard.scss';
import ImageNotFound from '../../../Assets/ImageNotFound.png';

interface IProps {
	game: Game;
	onClick: () => void;
}

export const GameInfoCard: React.FC<IProps> = ({ game, onClick }) => {
	return (
		<Card
			className="catalog-info-card"
			key={game.id}
			interactive={true}
			onClick={onClick}
		>
			<div style={{ display: 'flex' }}>
				<img
					src={game.thumbnailUrl ?? ImageNotFound}
					alt={`${game.name} image`}
					width="150"
				/>

				<div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 20 }}>
					<H2>{ucwords(game.name)}</H2>

					<span>{game.description}</span>
				</div>
			</div>
		</Card>
	);
};

GameInfoCard.displayName = 'GameInfoCard';
