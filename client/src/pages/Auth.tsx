import {
	type MouseEvent, type ChangeEvent, type FormEvent, useState,
} from 'react';
import {type User} from '../types/utilities/request.types';
import {Link} from 'react-router-dom';
import {request} from '../utilities/requests';
import {useUser} from '../context/UserContext';
import {usePopup} from '../context/PopupContext';
import {useTheme} from '../context/ThemeContext';
import {FcAddImage} from 'react-icons/fc';
import {Loading} from '../components/Loading';
import {ThemeButton} from '../components/Buttons';
import {BsEyeFill, BsEyeSlashFill} from 'react-icons/bs';
import lightLogo from '/zynqa_logo_light.png';
import darkLogo from '/zynqa_logo_dark.png';
import '../styles/pages/Auth.scss';

export function Auth({isSignup = false}: AuthProps) {
	const {setUser} = useUser();
	const {setPopup} = usePopup();
	const {theme} = useTheme();
	const [loading, setLoading] = useState(false);
	const [passwords, setPasswords] = useState<ShowPasswordsType>({
		password: false,
		confirmPassword: false,
	});
	const [authDetails, setAuthDetails] = useState<AuthDetailsType>({
		username: '',
		email: '',
		profilePicture: undefined,
		password: '',
		confirmPassword: '',
	});

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {name, value, files} = e.target;
		if (name === 'profilePicture' && files) {
			if (e?.target?.files?.[0].type.includes('image')) {
				setAuthDetails(prevState => ({
					...prevState,
					[name]: files[0],
				}));
			} else {
				setPopup('Must be a valid image type');
			}
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
				setPopup(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleShowPassword = (e: MouseEvent<HTMLButtonElement>, password: keyof ShowPasswordsType) => {
		e.currentTarget.blur();
		setPasswords(prevState => ({
			...prevState,
			[password]: !prevState[password],
		}));
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
						<p>Username</p>
						<input id='username' placeholder='Username' name='username' type='text' value={authDetails.username} onChange={e => {
							handleInputChange(e);
						}}/>
					</label>
					{isSignup && (
						<>
							<label htmlFor='email'>
								<p>Email</p>
								<input id='email' placeholder='Email' name='email' type='email' value={authDetails.email} onChange={e => {
									handleInputChange(e);
								}}/>
							</label>
							<label htmlFor='profilePicture' className='labelFile'>
								<p>Profile Picture</p>
								<main>
									{authDetails?.profilePicture ? (
										<img alt='Profile Picture' src={URL.createObjectURL(authDetails?.profilePicture)}/>
									) : <FcAddImage/>}
								</main>
								<input id='profilePicture' name='profilePicture' type='file' onChange={e => {
									handleInputChange(e);
								}}/>
							</label>
						</>
					)}
					<div className='labelPassword'>
						<label htmlFor='password'>
							<p>Password</p>
							<input
								id='password'
								placeholder='Password'
								name='password'
								type={passwords.password ? 'text' : 'password'}
								value={authDetails.password}
								onChange={e => {
									handleInputChange(e);
								}}
							/>
						</label>
						<button type='button' aria-label='Show Password' onClick={e => {
							handleShowPassword(e, 'password');
						}}>
							{passwords.password ? <BsEyeSlashFill/> : <BsEyeFill/>}
						</button>
					</div>
					{isSignup && (
						<div className='labelPassword'>
							<label htmlFor='confirmPassword'>
								<p>Confirm Password</p>
								<input
									id='confirmPassword'
									placeholder='Confirm Password'
									type={passwords.confirmPassword ? 'text' : 'password'}
									name='confirmPassword'
									value={authDetails.confirmPassword}
									onChange={e => {
										handleInputChange(e);
									}}
								/>
							</label>
							<button type='button' aria-label='Show Confirm Password' onClick={e => {
								handleShowPassword(e, 'confirmPassword');
							}}>
								{passwords.confirmPassword ? <BsEyeSlashFill/> : <BsEyeFill/>}
							</button>
						</div>
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
							<Link to='/login' className='transparentLink'>Login</Link>
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
