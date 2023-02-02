import * as React from 'react';
import { Card, H2 } from '@blueprintjs/core';
import { Game } from '../../../Api/Game-Catalog/Models/Games';
import { ucwords } from '../../Utility/string';
import './Catalog.scss';
import ImageNotFound from '../../../Assets/ImageNotFound.png';
import { Link } from 'react-router-dom';

interface IProps {
	game: Game;
}

export const GameInfoCard: React.FC<IProps> = ({ game,  }) => {
	return (
		<Link to={`/catalog/${game.id}`} className='catalog-card-link'>
			<Card
				className="catalog-info-card fixed-height"
				key={game.id}
				interactive={true}
			>
				<div className="catalog-card-content">
					<img
						src={game.thumbnailUrl ?? ImageNotFound}
						alt={`${game.name} image`}
						style={{ width: '100%' }}
					/>

					<div className="catalog-card-description">
						<H2>{ucwords(game.name)}</H2>

						<p>{game.description}</p >
					</div>
				</div>
			</Card>
		</Link>
	);
};

GameInfoCard.displayName = 'GameInfoCard';
