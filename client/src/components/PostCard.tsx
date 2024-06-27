import {type PostWithUserInfo} from '../types/pages/Posts.types';
import {Link} from 'react-router-dom';
import '../styles/components/PostCard.scss';
import {
	BiComment, BiDownArrowAlt, BiUpArrowAlt,
} from 'react-icons/bi';

export function PostCard({post}: {post: PostWithUserInfo}) {
	return (
		<Link to={`/post/${post.id}`} className='postCard'>
			<img alt='Profile Picture' src={post?.profile_picture}/>
			<header>
				<div>{post?.username}</div>
				<p>{post?.created_at.toLocaleString()}</p>
			</header>
			<main>
				{post?.post_picture && (
					<img alt='Post picture' src={post?.post_picture}/>
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
		</Link>
	);
}
