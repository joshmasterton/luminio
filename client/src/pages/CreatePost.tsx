import {
	type ChangeEvent, useState, useRef, useEffect, type FormEvent,
} from 'react';
import {type PostDetails} from '../types/pages/CreatePost.types';
import {ReturnNav} from '../components/ReturnNav';
import {usePopup} from '../context/PopupContext';
import {Loading} from '../components/Loading';
import {CgClose} from 'react-icons/cg';
import {FcAddImage} from 'react-icons/fc';
import {useNavigate} from 'react-router-dom';
import {request} from '../utilities/requests';
import '../styles/pages/CreatePost.scss';

export function CreatePost() {
	const navigate = useNavigate();
	const {setPopup} = usePopup();
	const [loading, setLoading] = useState(false);
	const [postDetails, setPostDetails] = useState<PostDetails>({
		post: '',
		postPicture: undefined,
	});
	const postInputRef = useRef<HTMLTextAreaElement>(null);
	const postPictureRef = useRef<HTMLInputElement>(null);

	const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const {name, value} = e.target;
		setPostDetails(prevState => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {name, files} = e.target;
		if (name === 'postPicture' && files) {
			if (e?.target?.files?.[0].type.includes('image')) {
				setPostDetails(prevState => ({
					...prevState,
					[name]: files[0],
				}));
			} else {
				if (postPictureRef.current) {
					postPictureRef.current.files = null;
				}

				setPopup('Must be a valid image type');
			}
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		if (loading) {
			return;
		}

		try {
			e.preventDefault();
			setLoading(true);
			const formData = new FormData();
			formData.append('post', postDetails.post);

			if (postDetails.postPicture) {
				formData.append('postPicture', postDetails.postPicture);
			}

			await request('/createPost', 'POST', formData, true);

			navigate('/');
		} catch (error) {
			if (error instanceof Error) {
				setPopup(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const updateTextareaSize = () => {
		if (postInputRef.current) {
			postInputRef.current.style.height = 'auto';
			postInputRef.current.style.height = `${postInputRef.current.scrollHeight}px`;
		}
	};

	useEffect(() => {
		updateTextareaSize();
	}, [postDetails.post]);

	useEffect(() => {
		const handleResizeEvent = () => {
			updateTextareaSize();
		};

		window.addEventListener('resize', handleResizeEvent);

		return () => {
			window.removeEventListener('resize', handleResizeEvent);
		};
	}, []);

	return (
		<>
			<ReturnNav isProfile/>
			<div id='createPost'>
				<form method='POST' onSubmit={async e => {
					await handleSubmit(e);
				}}>
					<header>
						<h1>Create post</h1>
					</header>
					<label htmlFor='post'>
						<textarea
							id='post'
							ref={postInputRef}
							name='post'
							placeholder='How are you today?'
							value={postDetails.post}
							onChange={e => {
								handleTextareaChange(e);
							}}
						/>
					</label>
					<div>
						{postDetails.postPicture && (
							<button type='button' aria-label='Remove picture' onClick={() => {
								setPostDetails(prevState => ({
									...prevState,
									postPicture: undefined,
								}));
								if (postPictureRef.current) {
									postPictureRef.current.files = null;
								}
							}}>
								<CgClose/>
							</button>
						)}
						<label htmlFor='postPicture' className='labelFile'>
							<main>
								{postDetails?.postPicture ? (
									<img alt='Post Picture' src={URL.createObjectURL(postDetails?.postPicture)}/>
								) : <FcAddImage/>}
							</main>
							<input
								id='postPicture'
								name='postPicture'
								type='file'
								ref={postPictureRef}
								onChange={e => {
									handleInputChange(e);
								}}
							/>
						</label>
						<button type='submit'>
							{loading ? <Loading className='backgroundShadeMax'/> : 'Send'}
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
