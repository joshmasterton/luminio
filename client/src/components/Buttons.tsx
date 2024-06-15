import {type UserButtonType} from '../types/components/Buttons.types';
import {useTheme} from '../context/ThemeContext';
import {BiMoon} from 'react-icons/bi';
import '../styles/components/Buttons.scss';

export function UserButton({user, type}: UserButtonType) {
	return (
		<button type='button' className={`userButton ${type}`} aria-label='User'>
			<img alt='Profile Picture' src={user?.profile_picture}/>
		</button>
	);
}

export function ThemeButton() {
	const {theme, toggleTheme} = useTheme();
	return (
		<div className={`themeToggler ${theme}`}>
			<button type='button' aria-label='Theme toggler' onClick={e => {
				toggleTheme(e);
			}}>
				<BiMoon/>
			</button>
		</div>
	);
}
