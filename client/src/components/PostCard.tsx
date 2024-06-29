import {type PostWithUserInfo} from '../types/pages/Posts.types';
import {Link} from 'react-router-dom';
import '../styles/components/PostCard.scss';
import {
	BiComment, BiDownArrowAlt, BiUpArrowAlt,
} from 'react-icons/bi';

export function PostCard({post}: {post: PostWithUserInfo}) {
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

	return (
		<div className='postCard'>
			<Link to={`/post/${post.id}`}/>
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
		</div>
	);
}
