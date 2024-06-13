import {useUser} from '../context/UserContext';

export function Nav() {
	const {user, logout} = useUser();
	return (
		<nav id='nav'>
			<div>{user?.username}</div>
			<div>{user?.email}</div>
			<div>{user?.profile_picture}</div>
			<img alt='' src={user?.profile_picture}/>
			<button type='button' onClick={async () => {
				await logout();
			}}>
				Logout
			</button>
		</nav>
	);
}
