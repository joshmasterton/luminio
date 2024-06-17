import {useState, type MouseEvent} from 'react';
import {BiHome, BiMenu} from 'react-icons/bi';
import {CgLogOut} from 'react-icons/cg';
import {useUser} from '../context/UserContext';
import {Link} from 'react-router-dom';
import {ThemeButton, UserButton} from './Buttons';
import {useTheme} from '../context/ThemeContext';
import lightLogo from '/zynqa_logo_light.png';
import darkLogo from '/zynqa_logo_dark.png';
import '../styles/components/Nav.scss';

export function Nav() {
	const {theme} = useTheme();
	const {user, logout} = useUser();
	const [isMenu, setIsMenu] = useState(false);

	const handleMenuSwitch = (e: MouseEvent<HTMLButtonElement>) => {
		setIsMenu(!isMenu);
		e.currentTarget.blur();
	};

	return (
		<nav id='nav'>
			<div />
			<header>
				<div>
					<button type='button' className='transparentButton' aria-label='Menu Button' onClick={e => {
						handleMenuSwitch(e);
					}}>
						<BiMenu/>
					</button>
					<img alt='Logo' src={theme === 'dark' ? lightLogo : darkLogo}/>
					<UserButton user={user}/>
					<ul>
						<li>
							<Link to='/' className='transparentButton'>
								<BiHome/>
							</Link>
						</li>
						<li>
							<button type='button' className='transparentButton' aria-label='Logout Button 1' onClick={async () => {
								await logout();
							}}>
								<CgLogOut/>
							</button>
						</li>
						<li>
							<ThemeButton/>
						</li>
					</ul>
				</div>
			</header>
			<main className={isMenu ? 'active' : 'hidden'}>
				<ul>
					<li>
						<Link to='/' className='transparentButton'>
							<BiHome/>
							Home
						</Link>
					</li>
					<li>
						<button type='button' className='transparentButton' aria-label='Logout Button 2' onClick={async () => {
							await logout();
						}}>
							<CgLogOut/>
							Logout
						</button>
					</li>
					<li>
						<ThemeButton/>
					</li>
				</ul>
			</main>
			<footer>
				<ul>
					<li>
						<UserButton user={user} type='large'/>
						<div>
							<h1>{user?.username}</h1>
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
						<button type='button' className='transparentButton' aria-label='Logout Button 3' onClick={async () => {
							await logout();
						}}>
							<CgLogOut/>
							Logout
						</button>
					</li>
				</ul>
			</footer>
		</nav>
	);
}
