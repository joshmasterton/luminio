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
	const [profile, setProfile] = useState<User | undefined>(undefined);
	const [isEdit, setIsEdit] = useState(false);
	const [editDetails, setEditDetails] = useState<EditDetails>({
		username: user?.username,
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

			const response = await request<FormData, User>('/updateProfile', 'PUT', formData, true);
			if (response) {
				setUser(response);
				navigate(`/profile/${response?.username}`);
				setEditDetails({
					username: response.username,
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

	useEffect(() => {
		getProfile()
			.catch(error => {
				if (error instanceof Error) {
					console.error(error.message);
				}
			});
	}, [location, user]);

	return (
		<div id='profile'>
			<ReturnNav/>
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
									<p>{profile?.likes}</p>
									<BiSolidUpvote/>
								</button>
								<button type='button' aria-label='dislikes'>
									<p>{profile?.dislikes}</p>
									<BiSolidDownvote/>
								</button>
								<button type='button' aria-label='comments'>
									<p>{profile?.comments}</p>
									<BiComment/>
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
	);
}
