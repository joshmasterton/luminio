import {type PostWithUserInfo} from '../types/pages/Posts.types';
import {MdPostAdd} from 'react-icons/md';
import {type MouseEvent, useEffect, useState} from 'react';
import {request} from '../utilities/requests';
import {Link} from 'react-router-dom';
import {PostCard} from '../components/PostCard';
import {Loading} from '../components/Loading';
import {Nav} from '../components/Nav';
import '../styles/pages/Posts.scss';

export function Posts() {
	const [page, setPage] = useState(0);
	const [posts, setPosts] = useState<PostWithUserInfo[] | undefined>(undefined);
	const [loading, setLoading] = useState(true);
	const [loadingMoreButton, setLoadingMoreButton] = useState(false);

	const getPosts = async (e?: MouseEvent<HTMLButtonElement>) => {
		try {
			if (e?.currentTarget) {
				e.currentTarget.blur();
			}

			const postsResponse = await request<unknown, PostWithUserInfo[]>(`/getPosts?page=${page}`, 'GET');

			if (postsResponse) {
				setLoadingMoreButton(postsResponse.length > 0);

				setPosts(prevState => {
					if (!prevState) {
						return [...postsResponse];
					}

					return [...prevState, ...postsResponse];
				});

				setPage(prevPage => prevPage + 1);
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
		getPosts()
			.catch(error => {
				if (error instanceof Error) {
					console.error(error.message);
				}
			});
	}, []);

	return (
		<>
			<Nav/>
			<div id='posts'>
				{loading ? (
					<Loading className='backgroundShade'/>
				) : (
					<div>
						{posts?.map(post => (
							<PostCard key={post.id} post={post}/>
						))}
						{loadingMoreButton && (
							<button type='button' onClick={async e => {
								await getPosts(e);
							}}>
								Load more
							</button>
						)}
					</div>
				)}
				<div id='createPost'>
					<Link to='/createPost' aria-label='Create post'>
						<MdPostAdd/>
					</Link>
				</div>
			</div>
		</>
	);
}
