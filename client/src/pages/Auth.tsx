import {type ChangeEvent, type FormEvent, useState} from 'react';
import {Link} from 'react-router-dom';
import {request} from '../utilities/requests';

export function Auth({isSignup = false}: AuthProps) {
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

		try {
			if (isSignup) {
				const formData = new FormData();
				formData.append('username', authDetails.username);
				formData.append('email', authDetails.email);
				formData.append('password', authDetails.password);
				if (authDetails.profilePicture) {
					formData.append('profilePicture', authDetails.profilePicture);
				}

				if (authDetails.confirmPassword) {
					formData.append('confirmPassword', authDetails.confirmPassword);
				}

				const signup = await request('/signup', 'POST', formData, true);
				console.log(signup);
			} else {
				await request('/login', 'POST', {
					username: authDetails.username,
					password: authDetails.password,
				});
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
			}
		}
	};

	return (
		<div id='auth'>
			<form name='authForm' method='POST' autoComplete='off' noValidate onSubmit={async e => {
				await handleSubmit(e);
			}}>
				<header>
					<h1>{isSignup ? 'Signup' : 'Login'}</h1>
				</header>
				<main>
					<label htmlFor='username'>
						Username
						<input id='username' name='username' type='text' value={authDetails.username} onChange={e => {
							handleInputChange(e);
						}}/>
					</label>
					{isSignup && (
						<>
							<label htmlFor='email'>
								Email
								<input id='email' name='email' type='email' value={authDetails.email} onChange={e => {
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
						<input id='password' name='password' type='password' value={authDetails.password} onChange={e => {
							handleInputChange(e);
						}}/>
					</label>
					{isSignup && (
						<label htmlFor='confirmPassword'>
							Confirm Password
							<input id='confirmPassword' name='confirmPassword' value={authDetails.confirmPassword} type='password' onChange={e => {
								handleInputChange(e);
							}}/>
						</label>
					)}
					<button type='submit'>
						{isSignup ? 'Signup' : 'Login'}
					</button>
				</main>
				<footer>
					{isSignup ? (
						<>
							<div>Already have an account?</div>
							<Link to='/'>Login</Link>
						</>
					) : (
						<>
							<div>Dont have an account?</div>
							<Link to='/signup'>Signup</Link>
						</>
					)}
				</footer>
			</form>
		</div>
	);
}
