import * as React from 'react';
import {Card, HTMLTable} from '@blueprintjs/core';
import {Board} from '../../../api/Game-Catalog/Models/Boards';
import {Images} from '../../../Images';
import {formatNumber, ucwords} from '../../../utility/string';
import './Catalog.scss';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

interface Props {
	board: Board;
}

export function BoardInfoCard({board}: Props) {
	return (
		<Card
			className="catalog-info-card"
			key={board.id}
		>
			<div>
				<div className="board-card-content">
					<img
						src={board.imageUrl ?? Images.NotFound}
						alt={`${board.name} image`}
						height="80"
					/>

					<h2>{ucwords(board.name)}</h2>
				</div>

				<SimpleBar style={{maxHeight: 260}}>
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
				</SimpleBar>
			</div>
		</Card>
	);
}
