import {type CommentWithUserInfo, type PostWithUserInfo} from '../types/utilities/request.types';
import {Link} from 'react-router-dom';
import {request} from '../utilities/requests';
import {
	type ChangeEvent, useRef, useState, useEffect, type FormEvent,
} from 'react';
import {
	BiComment, BiDownArrowAlt, BiUpArrowAlt,
} from 'react-icons/bi';
import {CommentCard} from './CommentCard';
import {Loading} from './Loading';
import {usePopup} from '../context/PopupContext';
import '../styles/components/PostCard.scss';

export function PostCard({post, canComment}: {post: PostWithUserInfo; canComment?: boolean}) {
	const {setPopup} = usePopup();
	const [loading, setLoading] = useState(false);
	const [commentText, setCommentText] = useState('');
	const [comments, setComments] = useState<CommentWithUserInfo[] | undefined>(undefined);
	const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
	const postDate = new Date(post.created_at).getTime();
	const dateNow = Date.now();
	const millisecondsAgo = dateNow - postDate;
	const	minutesAgo = Math.floor(millisecondsAgo / 60000);
	const hoursAgo = Math.floor(millisecondsAgo / 3600000);
	const daysAgo = Math.floor(millisecondsAgo / 86400000);
	let dateToShow: string;

	if (daysAgo > 0) {
		dateToShow = `${daysAgo}d`;
	} else if (hoursAgo > 0) {
		dateToShow = `${hoursAgo}h`;
	} else if (minutesAgo > 0) {
		dateToShow = `${minutesAgo}m`;
	} else {
		dateToShow = 'Just now';
	}

	const handleSubmit = async (e: FormEvent) => {
		try {
			setLoading(true);
			e.preventDefault();
			await request('/createComment', 'POST', {
				postId: post.id,
				commentText,
			});
		} catch (error) {
			if (error instanceof Error) {
				setPopup(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const {value} = e.target;
		setCommentText(value);
	};

	const updateTextareaSize = () => {
		if (commentTextareaRef.current) {
			commentTextareaRef.current.style.height = 'auto';
			commentTextareaRef.current.style.height = `${commentTextareaRef.current.scrollHeight}px`;
		}
	};

	const getComments = async () => {
		try {
			const commentsData = await request<unknown, CommentWithUserInfo[]>(`/getComments?postId=${post.id}`, 'GET');
			if (commentsData) {
				setComments(commentsData);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
	};

	useEffect(() => {
		updateTextareaSize();
	}, [commentText]);

	useEffect(() => {
		const handleResizeEvent = () => {
			updateTextareaSize();
		};

		window.addEventListener('resize', handleResizeEvent);

		return () => {
			window.removeEventListener('resize', handleResizeEvent);
		};
	}, []);

	useEffect(() => {
		if (canComment) {
			getComments()
				.catch(error => {
					if (error instanceof Error) {
						console.error(error.message);
					}
				});
		}
	}, []);

	return (
		<>
			<div className='postCard'>
				{!canComment && <Link to={`/post/${post.id}`}/>}
				<header>
					<Link to={`/profile/${post.user_id}`}>
						<img alt='Profile Picture' src={post?.profile_picture}/>
					</Link>
					<Link to={`/post/${post.id}`}>
						<div>{post?.username}</div>
						<p>{dateToShow}</p>
					</Link>
				</header>
				<main>
					{post?.post_picture && (
						<div className='imgContainer'>
							<img alt='Post picture' src={post?.post_picture}/>
							<img alt='Post picture' src={post?.post_picture}/>
						</div>
					)}
					{post?.post}
				</main>
				<footer>
					<button type='button' aria-label='likes'>
						<BiUpArrowAlt/>
						<p>{post?.likes}</p>
					</button>
					<button type='button' aria-label='dislikes'>
						<BiDownArrowAlt/>
						<p>{post?.dislikes}</p>
					</button>
					<button type='button' aria-label='comments'>
						<BiComment/>
						<p>{post?.comments}</p>
					</button>
				</footer>
				{canComment && (
					<form method='POST' onSubmit={async e => {
						await handleSubmit(e);
					}}>
						<label htmlFor='comment'>
							<textarea
								id='comment'
								name='comment'
								ref={commentTextareaRef}
								value={commentText}
								placeholder='Reply with a comment...'
								onChange={e => {
									handleTextareaChange(e);
								}}
							/>
						</label>
						<div>
							<button type='submit'>
								{loading ? <Loading className='backgroundShadeMax'/> : 'Send'}
							</button>
						</div>
					</form>
				)}
			</div>
			{comments && canComment ? comments.map(comment => (
				<CommentCard key={comment.id} comment={comment}/>
			)) : null}
		</>
	);
}
