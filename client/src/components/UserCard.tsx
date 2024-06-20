import {type User} from '../types/utilities/request.types';
import {Link} from 'react-router-dom';
import '../styles/components/UserCard.scss';

export function UserCard({user}: {user: User}) {
	return (
		<Link to={`/profile/${user.username}`} className='userCard'>
			<img alt='Profile Picture' src={user.profile_picture}/>
			<header>
				<div>{user?.username}</div>
				<p>{user?.email}</p>
			</header>
			<footer>
				<div/>
			</footer>
		</Link>
	);
}
