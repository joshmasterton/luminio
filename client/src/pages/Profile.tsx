import {type User} from '../types/utilities/request.types';
import {type FormEvent, type ChangeEvent, type MouseEvent} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {ReturnNav} from '../components/ReturnNav';
import {request} from '../utilities/requests';
import {useEffect, useState} from 'react';
import {useUser} from '../context/UserContext';
import {usePopup} from '../context/PopupContext';
import {Loading} from '../components/Loading';
import {
	BiComment, BiEdit, BiSolidDownvote, BiSolidUpvote,
} from 'react-icons/bi';
import {BsEyeFill, BsEyeSlashFill} from 'react-icons/bs';
import {IoImage} from 'react-icons/io5';
import {CgClose} from 'react-icons/cg';
import '../styles/pages/Profile.scss';

export function Profile() {
	const navigate = useNavigate();
	const location = useLocation();
	const username = location.pathname.split('/').pop();
	const {user, setUser} = useUser();
	const {setPopup} = usePopup();
	const [loading, setLoading] = useState(false);
	const [passwords, setPasswords] = useState<ShowPasswordsType>({
		password: false,
		confirmPassword: false,
	});
	const [profile, setProfile] = useState<User | undefined>(undefined);
	const [isEdit, setIsEdit] = useState(false);
	const [editDetails, setEditDetails] = useState<EditDetails>({
		username: user?.username,
		password: '',
		confirmPassword: '',
		profilePicture: undefined,
	});

	const getProfile = async () => {
		try {
			const profile = await request<undefined, User>(`/profile/?username=${username}`, 'GET');
			if (profile) {
				setProfile(profile);
			} else {
				navigate(-1);
			}
		} catch (error) {
			if (error instanceof Error) {
				navigate(-1);
			}
		}
	};

	const handleIsEdit = (e: MouseEvent<HTMLElement>) => {
		setIsEdit(!isEdit);
		e.currentTarget.blur();
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {name, value, files} = e.target;
		if (name === 'profilePicture' && files) {
			if (e?.target?.files?.[0].type.includes('image')) {
				setEditDetails(prevState => ({
					...prevState,
					[name]: files[0],
				}));
			} else {
				setPopup('Must be a valid image type');
			}
		} else {
			setEditDetails(prevState => ({
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
			const formData = new FormData();
			if (editDetails.username) {
				formData.append('username', editDetails.username);
			}

			if (editDetails.profilePicture) {
				formData.append('profilePicture', editDetails.profilePicture);
			}

			if (editDetails.password && editDetails.confirmPassword) {
				formData.append('password', editDetails.password);
				formData.append('confirmPassword', editDetails.password);
			}

			const response = await request<FormData, User>('/updateProfile', 'PUT', formData, true);
			if (response) {
				setUser(response);
				setProfile(response);
				setPopup('Successfully updated profile');
				setEditDetails({
					username: response?.username,
					password: '',
					confirmPassword: '',
					profilePicture: undefined,
				});
			}

			setIsEdit(!isEdit);
		} catch (error) {
			if (error instanceof Error) {
				setPopup(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleShowPassword = (password: keyof ShowPasswordsType) => {
		setPasswords(prevState => ({
			...prevState,
			[password]: !prevState[password],
		}));
	};

	useEffect(() => {
		getProfile()
			.catch(error => {
				if (error instanceof Error) {
					console.error(error.message);
				}
			});
	}, [location, user]);

	return (
		<>
			<ReturnNav/>
			<div id='profile'>
				<div id='profileContainer'>
					{user?.username === profile?.username ? (
						<button type='button' aria-label='Edit Button' onClick={e => {
							handleIsEdit(e);
						}}>
							{isEdit ? <CgClose/> : <BiEdit/>}
						</button>
					) : null}
					<img alt='Profile Picture' src={profile?.profile_picture}/>
					<main>
						{isEdit ? (
							<form method='PUT' autoComplete='off' aria-label='Edit Form' onSubmit={async e => {
								await handleSubmit(e);
							}}>
								<label htmlFor='username'>
									<p>Username</p>
									<input
										type='text'
										name='username'
										id='username'
										value={editDetails.username}
										placeholder={editDetails.username}
										onChange={e => {
											handleInputChange(e);
										}}
									/>
								</label>
								<div className='labelPassword'>
									<label htmlFor='password'>
										<p>Password</p>
										<input
											id='password'
											placeholder='Password'
											type={passwords.password ? 'text' : 'password'}
											name='password'
											value={editDetails.password}
											onChange={e => {
												handleInputChange(e);
											}}
										/>
									</label>
									<button type='button' aria-label='Show Confirm Password' onClick={() => {
										handleShowPassword('password');
									}}>
										{passwords.password ? <BsEyeSlashFill/> : <BsEyeFill/>}
									</button>
								</div>
								<div className='labelPassword'>
									<label htmlFor='confirmPassword'>
										<p>Confirm Password</p>
										<input
											id='confirmPassword'
											placeholder='Confirm Password'
											type={passwords.confirmPassword ? 'text' : 'password'}
											name='confirmPassword'
											value={editDetails.confirmPassword}
											onChange={e => {
												handleInputChange(e);
											}}
										/>
									</label>
									<button type='button' aria-label='Show Confirm Password' onClick={() => {
										handleShowPassword('confirmPassword');
									}}>
										{passwords.confirmPassword ? <BsEyeSlashFill/> : <BsEyeFill/>}
									</button>
								</div>
								<label htmlFor='profilePicture' className='labelFile'>
									<p>Profile Picture</p>
									<main>
										{editDetails?.profilePicture ? (
											<img alt='Profile Picture' src={URL.createObjectURL(editDetails?.profilePicture)}/>
										) : <IoImage/>}
									</main>
									<input
										id='profilePicture'
										name='profilePicture'
										type='file'
										onChange={e => {
											handleInputChange(e);
										}}
									/>
								</label>
								<button type='submit' className='primaryButton'>
									{loading ? (
										<Loading className='primary'/>
									) : 'Save'}
								</button>
							</form>
						) : (
							<>
								<header>
									<div>{profile?.username}</div>
									<p>{profile?.email}</p>
								</header>
								<div>
									<button type='button' aria-label='likes'>
										<BiSolidUpvote/>
										<p>{profile?.likes}</p>
									</button>
									<button type='button' aria-label='dislikes'>
										<BiSolidDownvote/>
										<p>{profile?.dislikes}</p>
									</button>
									<button type='button' aria-label='comments'>
										<BiComment/>
										<p>{profile?.comments}</p>
									</button>
								</div>
								<div>
									<button type='button' aria-label='Add Friend' className='primaryButton'>
										Add
									</button>
									<button type='button' aria-label='Remove Friend'>
										Remove
									</button>
								</div>

							</>
						)}
					</main>
				</div>
			</div>
		</>
	);
}
