import * as React from 'react';
import { Card, H2, HTMLTable } from '@blueprintjs/core';
import { Board } from '../../../Api/Game-Catalog/Models/Boards';
import { formatNumber, ucwords } from '../../Utility/string';
import './CatalogInfoCard.scss';
import ImageNotFound from '../../../Assets/ImageNotFound.png';
import { wrap } from 'module';

interface IProps {
	board: Board;
}

export const BoardInfoCard: React.FC<IProps> = ({ board }) => {
	return (
		<Card
			className="catalog-info-card"
			key={board.id}
		>
			<div>
				<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '1rem' }}>
					<img
						src={board.imageUrl ?? ImageNotFound}
						alt={`${board.name} image`}
						height="80"
					/>

					<h2 style={{ fontSize: '2rem', margin: 'unset', padding: '0 0 0 20px' }}>{ucwords(board.name)}</h2>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', paddingTop: 20 }}>

					<HTMLTable striped={true}>
						<thead>
							<tr>
								<th>Stage</th>
								<th>Points</th>
							</tr>
						</thead>

						<tbody>
							{board.stages.map(stage => (
								<tr key={`stage-${stage.id}`}>
									<td>{ucwords(stage.name)}</td>
									<td>{formatNumber(stage.requiredPoints)}</td>
								</tr>
							))}
						</tbody>
					</HTMLTable>
				</div>
			</div>
		</Card>
	);
};

BoardInfoCard.displayName = 'BoardInfoCard';
