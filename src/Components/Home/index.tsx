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
							<Card>
								<H5>
									<Link to="/catalog">Game Catalog</Link>
								</H5>

								<p>
									Browse our Game Catalog and start playing one of our games
								</p>

								<Link to="/catalog">
									<Button text="Explore catalog"/>
								</Link>
							</Card>

							<Card>
								<H5>
									<Link to="/game">Game Board</Link>
								</H5>

								<p>
									Continue playing your current stage
								</p>

								<Link to="/game">
									<Button text="Got to Game Board"/>
								</Link>
							</Card>
						</div>

						{
							isGranted(Permission.ADMIN) &&

							<>
								<Divider style={{ margin: "2rem 0"}}/>

								<H2>Admin</H2>

								<div className="cards-container">
									<Card>
										<H5>
											<Link to="/users">Users List</Link>
										</H5>

										<p>
											Browse our Users List
										</p>

										<Link to="/users"><Button text="Users List"/></Link>
									</Card>

									<Card>
										<H5>
											<Link to="/leaderboard">Leaderboard</Link>
										</H5>

										<p>
											Keep track of who is on top
										</p>

										<Link to="/leaderboard">
											<Button text="Got to Leaderboard"/>
										</Link>
									</Card>
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
