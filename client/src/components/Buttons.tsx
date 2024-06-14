import {type User} from '../types/utilities/request.types';
import {useTheme} from '../context/ThemeContext';
import {BiMoon} from 'react-icons/bi';

export function UserButton({user}: {user: User | undefined}) {
	return (
		<button type='button' className='userButton' aria-label='User'>
			<img alt='User' src={user?.profile_picture}/>
		</button>
	);
}

export function ThemeButton() {
	const {theme, toggleTheme} = useTheme();
	return (
		<div className={`theme ${theme}`}>
			<button type='button' className='themeButton' aria-label='Theme toggler' onClick={e => {
				toggleTheme(e);
			}}>
				<BiMoon/>
			</button>
		</div>
	);
}
