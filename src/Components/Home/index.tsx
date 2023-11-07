import * as React from 'react';
import {Card, H4, Icon, Intent} from '@blueprintjs/core';
import {Link} from 'react-router-dom';
import {Classes} from '../../classes';
import {IconSize} from '../../IconSize';
import {Permission, PermissionContext} from '../../Permission';
import {UserContext} from '../../Session';
import './Home.scss';
import {Spacing} from '../../Styles/variables';
import {PageHeader} from '../PageHeader';
import {UserClaimPointsDialog} from '../Pages/UserClaimPointsDialog';
import {classNames} from '../Utility/dom';

export const Home: React.FC = () => {
	const [showDialog, setShowDialog] = React.useState(false);

	const onDialogOpen = React.useCallback(() => setShowDialog(true), []);
	const onDialogClose = React.useCallback(() => setShowDialog(false), []);

	return (
		<UserContext.Consumer>
			{() => (
				<PermissionContext.Consumer>
					{([isGranted]) => (
						<div className={classNames(Classes.PAGE_WRAPPER, 'home-page-container')}>
							<PageHeader title="Home" />

							<div className="cards-container">
								<Card interactive={true} onClick={onDialogOpen}>
									<Icon icon="plus" size={35} intent={Intent.PRIMARY} />
									<div>
										<H4>Claim Points</H4>

										<p>Claim points from activities.</p>
									</div>
								</Card>
							</div>

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

							<H4 style={{marginTop: Spacing.XLarge}}>Quiz</H4>

							<div className="cards-container">
								<Link to="/quiz">
									<Card interactive={true}>
										<Icon icon="predictive-analysis" size={35} />
										<div>
											<H4>Take A Quiz</H4>

											<p>Complete the current quiz.</p>
										</div>
									</Card>
								</Link>

								<Link to="/quiz/history">
									<Card interactive={true}>
										<Icon icon="history" size={35} />

										<div>
											<H4>Quiz History</H4>

											<p>View past quiz submissions.</p>
										</div>
									</Card>
								</Link>
							</div>

							{
								isGranted(Permission.ADMIN) &&
								<>
									<H4 style={{marginTop: Spacing.XLarge}}>Admin</H4>

									<div className="cards-container">
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

										<Link to="/quiz/questions">
											<Card interactive={true}>
												<Icon icon="clipboard" size={35} />
												<div>
													<H4>Questions</H4>

													<p>Manage quiz questions.</p>
												</div>
											</Card>
										</Link>

										<Link to="/quiz/tags">
											<Card interactive={true}>
												<Icon icon="tag" size={35} />

												<div>
													<H4>Question Tags</H4>

													<p>Manage question tags and tag assignment to users.</p>
												</div>
											</Card>
										</Link>

										<Link to="/quiz/settings">
											<Card interactive={true}>
												<Icon icon="cog" size={35} />
												<div>
													<H4>Quiz Settings</H4>

													<p>Manage quiz frequency, question count, and point reward.</p>
												</div>
											</Card>
										</Link>
									</div>
								</>
							}

							<UserClaimPointsDialog onClose={onDialogClose} isOpen={showDialog} />
						</div>
					)}
				</PermissionContext.Consumer>
			)}
		</UserContext.Consumer>
	);
}

Home.displayName = 'Home';
