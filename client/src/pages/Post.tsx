import {type PostWithUserInfo} from '../types/utilities/request.types';
import {useEffect, useState} from 'react';
import {ReturnNav} from '../components/ReturnNav';
import {request} from '../utilities/requests';
import {useLocation} from 'react-router-dom';
import {PostCard} from '../components/PostCard';
import {Loading} from '../components/Loading';
import '../styles/pages/Post.scss';

export function Post() {
	const location = useLocation();
	const [post, setPost] = useState<PostWithUserInfo | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const postId = location.pathname.split('/').pop();

	const getPost = async () => {
		try {
			setLoading(true);
			const postData = await request<unknown, PostWithUserInfo>(`/getPost?postId=${postId}`, 'GET');
			if (postData) {
				setPost(postData);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getPost()
			.catch(error => {
				if (error instanceof Error) {
					console.error(error.message);
				}
			});
	}, []);

	return (
		<>
			<ReturnNav/>
			<div id='post'>
				<div>
					{loading ? (
						<Loading className='background'/>
					) : (
						<>
							{post && <PostCard post={post} canComment/>}
						</>
					)}
				</div>
			</div>
		</>
	);
}
