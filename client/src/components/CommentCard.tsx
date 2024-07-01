import {type CommentWithUserInfo} from '../types/utilities/request.types';
import {BiComment, BiDownArrowAlt, BiUpArrowAlt} from 'react-icons/bi';
import {Link} from 'react-router-dom';
import '../styles/components/CommentCard.scss';

export function CommentCard({comment}: {comment: CommentWithUserInfo}) {
	const commentDate = new Date(comment.created_at).getTime();
	const dateNow = Date.now();
	const millisecondsAgo = dateNow - commentDate;
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
		<div className='commentCard'>
			<header>
				<Link to={`/profile/${comment.user_id}`}>
					<img alt='Profile Picture' src={comment?.profile_picture}/>
				</Link>
				<Link to={`/post/${comment.post_id}`}>
					<div>{comment?.username}</div>
					<p>{dateToShow}</p>
				</Link>
			</header>
			<main>
				{comment?.comment}
			</main>
			<footer>
				<button type='button' aria-label='likes'>
					<BiUpArrowAlt/>
					<p>{comment?.likes}</p>
				</button>
				<button type='button' aria-label='dislikes'>
					<BiDownArrowAlt/>
					<p>{comment?.dislikes}</p>
				</button>
				<button type='button' aria-label='comments'>
					<BiComment/>
					<p>{comment?.comments}</p>
				</button>
			</footer>
		</div>
	);
}
