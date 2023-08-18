import {Card, H4, Icon} from '@blueprintjs/core';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {Classes} from '../../classes';
import {IconSize} from '../../IconSize';
import {Permission, PermissionContext} from '../../Permission';
import {UserContext} from '../../Session';
import './Home.scss';
import {Spacing} from '../../Styles/variables';
import {PageHeader} from '../PageHeader';
import {classNames} from '../Utility/dom';

export const Home: React.FC = () => (
	<UserContext.Consumer>
		{() => (
			<PermissionContext.Consumer>
				{([isGranted]) => (
					<div className={classNames(Classes.PAGE_WRAPPER, 'home-page-container')}>
						<PageHeader title="Home" />

						<H4 style={{marginTop: Spacing.XLarge}}>Game</H4>

						<div className="cards-container">
							<Link to="/game">
								<Card interactive={true}>
									<Icon icon="star" size={35} />
									<div>
										<H4>Game Board</H4>

										<p>Continue playing on your current game board.</p>
									</div>
								</Card>
							</Link>

							<Link to="/leaderboard">
								<Card interactive={true}>
									<Icon icon="properties" size={35} />

									<div>
										<H4>Leaderboard</H4>

										<p>See how users rank against each other.</p>
									</div>
								</Card>
							</Link>
						</div>

						{
							isGranted(Permission.ADMIN) &&
							<>
								<H4 style={{marginTop: Spacing.XLarge}}>Admin</H4>

								<div className="cards-container admin">
									<Link to="/catalog">
										<Card interactive={true}>
											<Icon icon="layers" size={IconSize.XLARGE} />
											<div>
												<H4>Game Catalog</H4>
												<p>Browse our Game Catalog and start playing one of our games.</p>
											</div>
										</Card>
									</Link>

									<Link to="/users">
										<Card interactive={true}>
											<Icon icon="people" size={35} />
											<div>
												<H4>Users List</H4>

												<p>Browse users list, manage users, and give points.</p>
											</div>
										</Card>
									</Link>

									<Link to="/sources">
										<Card interactive={true}>
											<Icon icon="bank-account" size={35} />
											<div>
												<H4>Sources</H4>

												<p>Manage point sources and give points to multiple users.</p>
											</div>
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
