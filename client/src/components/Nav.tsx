import {useTheme} from '../context/ThemeContext';
import {useUser} from '../context/UserContext';

export function Nav() {
	const {user, logout} = useUser();
	const {toggleTheme} = useTheme();
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
			<button type='button' onClick={e => {
				toggleTheme(e);
			}}>
				Theme toggler
			</button>
		</nav>
	);
}
