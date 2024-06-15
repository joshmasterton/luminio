import {type ChangeEvent, type FormEvent, useState} from 'react';
import {type User} from '../types/utilities/request.types';
import {Link} from 'react-router-dom';
import {request} from '../utilities/requests';
import {useUser} from '../context/UserContext';
import {useTheme} from '../context/ThemeContext';
import {Loading} from '../components/Loading';
import {ThemeButton} from '../components/Buttons';
import lightLogo from '../../public/zynqa_logo_light.png';
import darkLogo from '../../public/zynqa_logo_dark.png';
import '../styles/pages/Auth.scss';

export function Auth({isSignup = false}: AuthProps) {
	const {setUser} = useUser();
	const {theme} = useTheme();
	const [loading, setLoading] = useState(false);
	const [authDetails, setAuthDetails] = useState<AuthDetailsType>({
		username: 'testUser',
		email: 'email@gmail.com',
		profilePicture: undefined,
		password: 'Password',
		confirmPassword: 'Password',
	});

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {name, value, files} = e.target;
		if (name === 'profilePicture' && files) {
			setAuthDetails(prevState => ({
				...prevState,
				[name]: files[0],
			}));
		} else {
			setAuthDetails(prevState => ({
				...prevState,
				[name]: value,
			}));
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (loading) {
			return;
		}

		try {
			setLoading(true);
			if (isSignup) {
				const formData = new FormData();
				formData.append('username', authDetails.username);
				formData.append('password', authDetails.password);
				if (authDetails.email) {
					formData.append('email', authDetails.email);
				}

				if (authDetails.profilePicture) {
					formData.append('profilePicture', authDetails.profilePicture);
				}

				if (authDetails.confirmPassword) {
					formData.append('confirmPassword', authDetails.confirmPassword);
				}

				const signup = await request<FormData, User>('/signup', 'POST', formData, true);
				if (signup) {
					setUser(signup);
				}
			} else {
				const login = await request<AuthDetailsType, User>('/login', 'POST', {
					username: authDetails.username,
					password: authDetails.password,
				});
				if (login) {
					setUser(login);
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div id='auth'>
			<img alt='Logo' src={theme === 'dark' ? lightLogo : darkLogo}/>
			<form name='authForm' method='POST' autoComplete='off' noValidate onSubmit={async e => {
				await handleSubmit(e);
			}}>
				<header>
					<h1>{isSignup ? 'Signup' : 'Login'}</h1>
					<ThemeButton/>
				</header>
				<main>
					<label htmlFor='username'>
						Username
						<input id='username' placeholder='Username' name='username' type='text' value={authDetails.username} onChange={e => {
							handleInputChange(e);
						}}/>
					</label>
					{isSignup && (
						<>
							<label htmlFor='email'>
								Email
								<input id='email' placeholder='Email' name='email' type='email' value={authDetails.email} onChange={e => {
									handleInputChange(e);
								}}/>
							</label>
							<label htmlFor='profilePicture'>
								Profile Picture
								<input id='profilePicture' name='profilePicture' type='file' onChange={e => {
									handleInputChange(e);
								}}/>
							</label>
						</>
					)}
					<label htmlFor='password'>
						Password
						<input id='password' placeholder='Password' name='password' type='password' value={authDetails.password} onChange={e => {
							handleInputChange(e);
						}}/>
					</label>
					{isSignup && (
						<label htmlFor='confirmPassword'>
							Confirm Password
							<input id='confirmPassword' placeholder='Confirm Password' name='confirmPassword' value={authDetails.confirmPassword} type='password' onChange={e => {
								handleInputChange(e);
							}}/>
						</label>
					)}
					<button type='submit' className='primaryButton'>
						{loading ? (
							<Loading className='primary'/>
						) : (
							<div>
								{isSignup ? 'Signup' : 'Login'}
							</div>
						)}
					</button>
				</main>
				<footer>
					{isSignup ? (
						<>
							<p>Already have an account?</p>
							<Link to='/' className='transparentLink'>Login</Link>
						</>
					) : (
						<>
							<p>Dont have an account?</p>
							<Link to='/signup' className='transparentLink'>Signup</Link>
						</>
					)}
				</footer>
			</form>
		</div>
	);
}
