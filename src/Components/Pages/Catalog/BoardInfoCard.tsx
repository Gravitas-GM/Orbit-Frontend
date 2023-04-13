import * as React from 'react';
import { Card, HTMLTable } from '@blueprintjs/core';
import { Board } from '../../../Api/Game-Catalog/Models/Boards';
import { formatNumber, ucwords } from '../../Utility/string';
import './Catalog.scss';
import ImageNotFound from '../../../Assets/ImageNotFound.png';

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
				<div className="board-card-content">
					<img
						src={board.imageUrl ?? ImageNotFound}
						alt={`${board.name} image`}
						height="80"
					/>

					<h2>{ucwords(board.name)}</h2>
				</div>

				<div className="catalog-table-container">
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
