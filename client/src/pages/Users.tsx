import {type User} from '../types/utilities/request.types';
import {type MouseEvent, useEffect, useState} from 'react';
import {Nav} from '../components/Nav';
import {request} from '../utilities/requests';
import {Loading} from '../components/Loading';
import {UserCard} from '../components/UserCard';
import '../styles/pages/Users.scss';

export function Users() {
	const [page, setPage] = useState<number>(0);
	const [loadingMoreButton, setLoadingMoreButton] = useState(false);
	const [users, setUsers] = useState<User[] | undefined>(undefined);
	const [loading, setLoading] = useState(true);

	const getUsers = async (e?: MouseEvent<HTMLButtonElement>) => {
		try {
			if (e?.currentTarget) {
				e.currentTarget.blur();
			}

			const usersData = await request<undefined, User[]>(`/getUsers?page=${page}&sort=username`, 'GET');

			if (usersData) {
				setLoadingMoreButton(usersData.length >= 9);

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
				{loading ? (
					<Loading className='background'/>
				) : (
					<main>
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
					</main>
				)}
			</div>
		</>
	);
}
