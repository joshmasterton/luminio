import {useNavigate} from 'react-router-dom';
import {BiChevronLeft} from 'react-icons/bi';
import {useTheme} from '../context/ThemeContext';
import lightLogo from '/zynqa_logo_light.png';
import darkLogo from '/zynqa_logo_dark.png';
import '../styles/components/ReturnNav.scss';

export function ReturnNav() {
	const navigate = useNavigate();
	const {theme} = useTheme();

	const handleButtonClick = () => {
		navigate(-1);
	};

	return (
		<nav id='returnNav'>
			<div/>
			<header>
				<div>
					<button type='button' aria-label='Return Button' onClick={() => {
						handleButtonClick();
					}}>
						<BiChevronLeft/>
					</button>
					<img alt='Logo' className='logo' src={theme === 'dark' ? lightLogo : darkLogo}/>
				</div>
			</header>
		</nav>
	);
}
