import { Button, Card, Classes, Divider, H2, H5 } from '@blueprintjs/core';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Permission, PermissionContext  } from '../../Permission';
import { UserContext } from '../../Session';
import "./Home.scss"

export const Home: React.FC = () => (
	<UserContext.Consumer>
		{() => (
			<PermissionContext.Consumer>
				{([isGranted]) => (
					<div className="gm-page-wrapper">
						Welcome to Orbit!

						<H2 style={{marginTop: '2rem' }}>Game</H2>

						<div className="cards-container">
							<Link to="/catalog">
								<Card>
									<H5>Game Catalog</H5>

									<p>Browse our Game Catalog and start playing one of our games</p>
								</Card>
							</Link>

							<Link to="/game">
								<Card>
									<H5>Game Board</H5>

									<p>Continue playing on your current game board.</p>
								</Card>
							</Link>

							<Link to="/leaderboard">
								<Card>
									<H5>Leaderboard</H5>

									<p>See how users rank against each other.</p>
								</Card>
							</Link>
						</div>

						{
							isGranted(Permission.ADMIN) &&
							<>
								<H2 style={{marginTop: '2rem' }}>Admin</H2>


								<div className="cards-container admin">

									<Link to="/users">
										<Card>
											<H5>Users List</H5>

											<p>Browse users list, manage users, and give points.</p>
										</Card>
									</Link>


									<Link to="/sources">
										<Card>
											<H5>Sources</H5>

											<p>Manage point sources and give points to multiple users.</p>
										</Card>
									</Link>
								</div>
							</>
						}
					</div>
				)}
			</PermissionContext.Consumer>
		)}
	</UserContext.Consumer>

);

Home.displayName = 'Home';
