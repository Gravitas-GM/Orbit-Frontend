import * as React from 'react';
import {Card, H2, Icon} from '@blueprintjs/core';
import {Game} from '../../../Api/Game-Catalog/Models/Games';
import {Images} from '../../../Images';
import {ucwords} from '../../Utility/string';
import './Catalog.scss';
import {Link} from 'react-router-dom';

interface IProps {
	game: Game;
}

export const GameInfoCard: React.FC<IProps> = ({game}) => {
	return (
		<Link to={`/catalog/${game.id}`} className="catalog-card-link">
			<Card
				className="catalog-info-card fixed-height"
				key={game.id}
				interactive={true}
			>
				<div className="catalog-card-content">
					<figure className="game-image-wrapper">
						<img
							src={game.thumbnailUrl ?? Images.NotFound}
							alt={`${game.name} image`}
							style={{width: '100%'}}
						/>
					</figure>

					<div className="catalog-card-description">
						<H2>{ucwords(game.name)}</H2>

						<p>{game.description}</p>

						{!game.publishedDate && (
							<p className="catalog-card-under-construction">
								<Icon style={{paddingRight: 5}} icon="build" /> Under Construction
							</p>
						)}
					</div>
				</div>
			</Card>
		</Link>
	);
};

GameInfoCard.displayName = 'GameInfoCard';
