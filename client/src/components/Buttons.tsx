import {type UserButtonType} from '../types/components/Buttons.types';
import {useTheme} from '../context/ThemeContext';
import {useNavigate} from 'react-router-dom';
import {BiMoon} from 'react-icons/bi';
import '../styles/components/Buttons.scss';

export function UserButton({user, type}: UserButtonType) {
	const navigate = useNavigate();
	const handleButtonClick = () => {
		navigate(`/profile/${user?.id}`);
	};

	return (
		<button type='button' className={`userButton ${type}`} aria-label='User' onClick={() => {
			handleButtonClick();
		}}>
			<img alt='Profile Picture' src={user?.profile_picture}/>
		</button>
	);
}

export function ThemeButton() {
	const {theme, toggleTheme} = useTheme();
	return (
		<div className={`themeToggler ${theme}`}>
			<button type='button' aria-label='Theme Toggler' className={theme} onClick={e => {
				toggleTheme(e);
			}}>
				<BiMoon/>
			</button>
		</div>
	);
}
