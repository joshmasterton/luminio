import {Link, useNavigate} from 'react-router-dom';
import {
	BiChevronLeft, BiGroup, BiHome, BiUser,
} from 'react-icons/bi';
import {useTheme} from '../context/ThemeContext';
import lightLogo from '/zynqa_logo_light.png';
import darkLogo from '/zynqa_logo_dark.png';
import {UserButton} from './Buttons';
import {useUser} from '../context/UserContext';
import {CgLogOut} from 'react-icons/cg';
import '../styles/components/ReturnNav.scss';

export function ReturnNav({isProfile = false}: {isProfile?: boolean}) {
	const navigate = useNavigate();
	const {theme} = useTheme();
	const {user, logout} = useUser();

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
			{isProfile && (
				<footer>
					<ul>
						<li>
							<UserButton user={user} type='large'/>
							<div>
								<div>{user?.username}</div>
								<p>{user?.email}</p>
							</div>
						</li>
						<li>
							<Link to='/' className='transparentButton'>
								<BiHome/>
								Home
							</Link>
						</li>
						<li>
							<Link to={`/profile/${user?.username}`} className='transparentButton'>
								<BiUser/>
								Profile
							</Link>
						</li>
						<li>
							<Link to='/users' className='transparentButton'>
								<BiGroup/>
								Users
							</Link>
						</li>
						<li>
							<button type='button' className='transparentButton' aria-label='Logout Button 3' onClick={async () => {
								await logout();
							}}>
								<CgLogOut/>
								Logout
							</button>
						</li>
					</ul>
				</footer>
			)}
		</nav>
	);
}
