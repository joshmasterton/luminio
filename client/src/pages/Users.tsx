import {type User} from '../types/utilities/request.types';
import {
	type MouseEvent, useEffect, useState,
} from 'react';
import {Nav} from '../components/Nav';
import {request} from '../utilities/requests';
import {Loading} from '../components/Loading';
import {UserCard} from '../components/UserCard';
import {CgClose} from 'react-icons/cg';
import '../styles/pages/Users.scss';

export function Users() {
	const [page, setPage] = useState<number>(0);
	const [loadingMoreButton, setLoadingMoreButton] = useState(false);
	const [users, setUsers] = useState<User[] | undefined>(undefined);
	const [searchUsers, setSearchUsers] = useState('');
	const [loading, setLoading] = useState(true);

	const getUsers = async (e?: MouseEvent<HTMLButtonElement>) => {
		try {
			if (e?.currentTarget) {
				e.currentTarget.blur();
			}

			const usersData = await request<undefined, User[]>(`/getUsers?page=${page}`, 'GET');

			if (usersData) {
				setLoadingMoreButton(usersData.length > 0);

				setUsers(prevState => {
					if (!prevState) {
						return [...usersData];
					}

					return [...prevState, ...usersData];
				});

				setPage(prevPage => prevPage + 1);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleSearchUsers = async (filterValue: string) => {
		try {
			setSearchUsers(filterValue);
			const searchedUsers = await request<unknown, User[]>(`/getUsers?filter=${filterValue}`, 'GET');
			setUsers(searchedUsers);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
	};

	const handleClearInput = async (e: MouseEvent<HTMLButtonElement>) => {
		try {
			e.currentTarget.blur();
			setSearchUsers('');
			const searchedUsers = await request<unknown, User[]>('/getUsers', 'GET');
			setUsers(searchedUsers);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
	};

	useEffect(() => {
		getUsers()
			.catch(error => {
				if (error instanceof Error) {
					console.error(error.message);
				}
			});
	}, []);

	return (
		<>
			<Nav/>
			<div id='users'>
				<main>
					{loading ? (
						<Loading className='backgroundShade'/>
					) : (
						<>
							<form method='GET' className='labelSearch' autoComplete='off'>
								<label htmlFor='userSearch'>
									<input type='text' id='userSearch' value={searchUsers} onChange={async e => {
										await handleSearchUsers(e.target.value);
									}} placeholder='Search for user...'/>
								</label>
								<button type='button' aria-label='clearUserSearch' onClick={async e => {
									await handleClearInput(e);
								}}>
									<CgClose/>
								</button>
							</form>
							{users && users.length > 0 ? (
								users?.map(user => (
									<UserCard key={user.id} user={user}/>
								))
							) : <div>No users</div>}
							{loadingMoreButton && (
								<button type='button' onClick={async e => {
									await getUsers(e);
								}}>
							Load more
								</button>
							)}
						</>
					)}
				</main>
			</div>
		</>
	);
}
