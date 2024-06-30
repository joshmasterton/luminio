import {useEffect, useState, type MouseEvent} from 'react';
import {
	BiGroup, BiHome, BiMenu, BiUser,
} from 'react-icons/bi';
import {CgClose, CgLogOut} from 'react-icons/cg';
import {useUser} from '../context/UserContext';
import {Link} from 'react-router-dom';
import {ThemeButton, UserButton} from './Buttons';
import {useTheme} from '../context/ThemeContext';
import {Loading} from './Loading';
import lightLogo from '/zynqa_logo_light.png';
import darkLogo from '/zynqa_logo_dark.png';
import '../styles/components/Nav.scss';

export function Nav() {
	const {theme} = useTheme();
	const [loading, setLoading] = useState(false);
	const {user, logout} = useUser();
	const [isMenu, setIsMenu] = useState(false);

	const handleMenuSwitch = (e: MouseEvent<HTMLButtonElement>) => {
		setIsMenu(!isMenu);
		e.currentTarget.blur();
	};

	const handleScroll = () => {
		setIsMenu(false);
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<nav id='nav'>
			<div/>
			<header>
				<div>
					<button type='button' className='transparentButton' aria-label='Menu Button' onClick={e => {
						handleMenuSwitch(e);
					}}>
						{isMenu ? <CgClose/> : <BiMenu/>}
					</button>
					<img alt='Logo' className='logo' src={theme === 'dark' ? lightLogo : darkLogo}/>
					<UserButton user={user}/>
					<ul>
						<li>
							<Link to='/' className='transparentButton'>
								<BiHome/>
							</Link>
						</li>
						<li>
							<Link to={`/profile/${user?.id}`} className='transparentButton'>
								<BiUser/>
							</Link>
						</li>
						<li>
							<Link to='/friends' className='transparentButton'>
								<BiGroup/>
							</Link>
						</li>
						<li>
							<button type='button' className='transparentButton' aria-label='Logout Button 1' onClick={async () => {
								setLoading(true);
								await logout();
								setLoading(false);
							}}>
								{loading ? (
									<Loading className='backgroundShade'/>
								) : <CgLogOut/>}
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
						<Link to={`/profile/${user?.id}`} className='transparentButton'>
							<BiUser/>
							Profile
						</Link>
					</li>
					<li>
						<Link to='/friends' className='transparentButton'>
							<BiGroup/>
							Friends
						</Link>
					</li>
					<li>
						<button type='button' className='transparentButton' aria-label='Logout Button 2' onClick={async () => {
							setLoading(true);
							await logout();
							setLoading(false);
						}}>
							<CgLogOut/>
							<div>Logout</div>
							{loading && (
								<Loading className='backgroundShade'/>
							)}
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
						<Link to={`/profile/${user?.id}`} className='transparentButton'>
							<BiUser/>
							Profile
						</Link>
					</li>
					<li>
						<Link to='/friends' className='transparentButton'>
							<BiGroup/>
							Friends
						</Link>
					</li>
					<li>
						<button type='button' className='transparentButton' aria-label='Logout Button 3' onClick={async () => {
							setLoading(true);
							await logout();
							setLoading(false);
						}}>
							<CgLogOut/>
							<div>Logout</div>
							{loading && (
								<Loading className='backgroundShade'/>
							)}
						</button>
					</li>
				</ul>
			</footer>
		</nav>
	);
}
