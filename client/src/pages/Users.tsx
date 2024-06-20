import {type User} from '../types/utilities/request.types';
import {useEffect, useState} from 'react';
import {Nav} from '../components/Nav';
import {request} from '../utilities/requests';
import {UserCard} from '../components/UserCard';
import '../styles/pages/Users.scss';

export function Users() {
	const [users, setUsers] = useState<User[] | undefined>(undefined);

	const getUsers = async () => {
		try {
			const usersData = await request<undefined, User[]>('/users', 'GET');
			if (usersData) {
				setUsers(usersData);
			}
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
					{users ? (
						users?.map(user => (
							<UserCard key={user.id} user={user}/>
						))
					) : <div>No users</div>}
				</main>
			</div>
		</>
	);
}
