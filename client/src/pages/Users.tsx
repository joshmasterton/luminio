import {type User} from '../types/utilities/request.types';
import {
	type MouseEvent, useEffect, useState, type ChangeEvent,
} from 'react';
import {ReturnNav} from '../components/ReturnNav';
import {request} from '../utilities/requests';
import {Loading} from '../components/Loading';
import {UserCard} from '../components/UserCard';
import {useUser} from '../context/UserContext';
import {CgClose} from 'react-icons/cg';
import '../styles/pages/Users.scss';

export function Users() {
	const [page, setPage] = useState<number>(0);
	const {user} = useUser();
	const [users, setUsers] = useState<User[] | undefined>(undefined);
	const [searchUsers, setSearchUsers] = useState('');
	const [loading, setLoading] = useState(true);
	const [loadingSearch, setLoadingSearch] = useState(false);
	const [loadingMoreButton, setLoadingMoreButton] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const getUsers = async (pageNumber: number, searchQuery = '', accepted = true) => {
		try {
			const usersData = await request<undefined, User[]>(`/getUsers?page=${pageNumber}&userId=${user?.id}&searchQuery=${searchQuery}&accepted=${accepted}`, 'GET');
			if (usersData) {
				if (usersData.length > 0) {
					setLoadingMoreButton(true);
				} else {
					setLoadingMoreButton(false);
				}

				if (pageNumber === 0) {
					setUsers(usersData);
				} else {
					setUsers(prevState => {
						if (!prevState) {
							return [...usersData];
						}

						return [...prevState, ...usersData];
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
			await getUsers(page, '');
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		} finally {
			setIsLoadingMore(false);
		}
	};

	const handleSearchUsersInput = async (e: ChangeEvent<HTMLInputElement>) => {
		try {
			const {value} = e.target;
			setSearchUsers(value);
			setPage(0);
			setLoadingSearch(true);
			await getUsers(0, value);
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
			setSearchUsers('');
			await getUsers(0, '');
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
	};

	useEffect(() => {
		setLoading(true);
		getUsers(page)
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
			<ReturnNav/>
			<div id='users'>
				<main>
					{loading ? (
						<Loading className='background'/>
					) : (
						<>
							<form method='GET' className='labelSearch' autoComplete='off'>
								<label htmlFor='userSearch'>
									<input type='text' id='userSearch' value={searchUsers} onChange={async e => {
										await handleSearchUsersInput(e);
									}} placeholder='Search for users...'/>
								</label>
								<button type='button' aria-label='clearUserSearch' onClick={async e => {
									await handleClearInput(e);
								}}>
									{loadingSearch ? <Loading className='backgroundShade'/> : <CgClose/>}
								</button>
							</form>
							{users && users.length > 0 ? (
								users?.map(user => (
									<UserCard key={user.id} user={user}/>
								))
							) : <div>No users</div>}
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
			</div>
		</>
	);
}
