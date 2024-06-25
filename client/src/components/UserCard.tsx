import {type Friendship, type User} from '../types/utilities/request.types';
import {Link} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {request} from '../utilities/requests';
import '../styles/components/UserCard.scss';

export function UserCard({user}: {user: User}) {
	const [friendship, setFriendship] = useState<Friendship | undefined>(undefined);

	const getFriendship = async () => request<unknown, Friendship>(`/getFriendship?friendId=${user?.id}`, 'GET');

	useEffect(() => {
		getFriendship()
			.then(friendshipData => {
				if (friendshipData?.id) {
					setFriendship(friendshipData);
				}
			})
			.catch(error => {
				if (error instanceof Error) {
					console.error(error);
				}
			});
	}, []);

	return (
		<Link to={`/profile/${user.username}`} className='userCard'>
			<img alt='Profile Picture' src={user.profile_picture}/>
			<header>
				<div>{user?.username}</div>
				<p>{user?.email}</p>
			</header>
			<footer>
				{!(friendship?.friendship_accepted) && friendship && (
					<p>Waiting</p>
				)}
				{friendship?.friendship_accepted ? (
					<p>Friends</p>
				) : null}
			</footer>
		</Link>
	);
}
