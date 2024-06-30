import {type User} from '../types/utilities/request.types';
import {
	type MouseEvent, useEffect, useState, type ChangeEvent,
} from 'react';
import {Nav} from '../components/Nav';
import {Link} from 'react-router-dom';
import {request} from '../utilities/requests';
import {Loading} from '../components/Loading';
import {UserCard} from '../components/UserCard';
import {useUser} from '../context/UserContext';
import {CgClose, CgUserAdd} from 'react-icons/cg';
import '../styles/pages/Friends.scss';

export function Friends() {
	const [page, setPage] = useState<number>(0);
	const {user} = useUser();
	const [friends, setFriends] = useState<User[] | undefined>(undefined);
	const [isFriendsPage, setIsFriendsPage] = useState(true);
	const [searchFriends, setSearchFriends] = useState('');
	const [loading, setLoading] = useState(true);
	const [loadingSearch, setLoadingSearch] = useState(false);
	const [loadingMoreButton, setLoadingMoreButton] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const getFriends = async (pageNumber: number, searchQuery = '', accepted = true) => {
		try {
			const friendsData = await request<undefined, User[]>(`/getFriends?page=${pageNumber}&userId=${user?.id}&searchQuery=${searchQuery}&accepted=${accepted}`, 'GET');
			if (friendsData) {
				if (friendsData.length > 0) {
					setLoadingMoreButton(true);
				} else {
					setLoadingMoreButton(false);
				}

				if (pageNumber === 0) {
					setFriends(friendsData);
				} else {
					setFriends(prevState => {
						if (!prevState) {
							return [...friendsData];
						}

						return [...prevState, ...friendsData];
					});
				}

				setPage(prevPage => prevPage + 1);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
				setLoadingMoreButton(false);
			}
		}
	};

	const handleLoadingMore = async (e: MouseEvent<HTMLButtonElement>) => {
		try {
			setIsLoadingMore(true);
			e?.currentTarget.blur();
			await getFriends(page, '', isFriendsPage);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		} finally {
			setIsLoadingMore(false);
		}
	};

	const handleChangeFriendsPage = async (e: MouseEvent<HTMLButtonElement>) => {
		try {
			const {name} = e.currentTarget;
			e?.currentTarget.blur();
			setIsFriendsPage(name === 'friends');
			setLoading(true);
			setPage(0);
			await getFriends(0, searchFriends, !isFriendsPage);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleSearchUsersInput = async (e: ChangeEvent<HTMLInputElement>) => {
		try {
			const {value} = e.target;
			setSearchFriends(value);
			setPage(0);
			setLoadingSearch(true);
			await getFriends(0, value, isFriendsPage);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		} finally {
			setLoadingSearch(false);
		}
	};

	const handleClearInput = async (e?: MouseEvent<HTMLButtonElement>) => {
		try {
			e?.currentTarget.blur();
			setSearchFriends('');
			setPage(0);
			await getFriends(0, '', isFriendsPage);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
	};

	useEffect(() => {
		setLoading(true);
		getFriends(0)
			.then(() => {
				setLoading(false);
			})
			.catch(error => {
				if (error instanceof Error) {
					console.error(error.message);
				}
			});
	}, []);

	return (
		<>
			<Nav/>
			<div id='friends'>
				<main>
					{loading ? (
						<Loading className='backgroundShade'/>
					) : (
						<>
							<header>
								<button type='button' name='friends' className={isFriendsPage ? 'primaryButton' : ''} onClick={async e => {
									await handleChangeFriendsPage(e);
								}}>
									Friends
								</button>
								<button type='button' name='requests' className={isFriendsPage ? '' : 'primaryButton'} onClick={async e => {
									await handleChangeFriendsPage(e);
								}}>
									Requests
								</button>
							</header>
							<form method='GET' className='labelSearch' autoComplete='off'>
								<label htmlFor='userSearch'>
									<input type='text' id='userSearch' value={searchFriends} onChange={async e => {
										await handleSearchUsersInput(e);
									}} placeholder={isFriendsPage ? 'Search for friends...' : 'Search for friend requests...'}/>
								</label>
								<button type='button' aria-label='clearUserSearch' onClick={async e => {
									await handleClearInput(e);
								}}>
									{loadingSearch ? <Loading className='backgroundShadeMax'/> : <CgClose/>}
								</button>
							</form>
							{friends && friends.length > 0 ? (
								friends?.map(friend => (
									<UserCard key={friend.id} user={friend}/>
								))
							) : <div>{isFriendsPage ? 'No friends' : 'No friend requests'}</div>}
							{loadingMoreButton && (
								<button type='button' onClick={async e => {
									await handleLoadingMore(e);
								}}>
									{isLoadingMore ? <Loading className='background'/> : 'Load more'}
								</button>
							)}
						</>
					)}
				</main>
				<div id='findUser'>
					<Link to='/users' aria-label='Users'>
						<CgUserAdd/>
					</Link>
				</div>
			</div>
		</>
	);
}
