import {useEffect, type ReactNode} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUser} from '../context/UserContext';

export function PublicRoute({children}: {children: ReactNode}) {
	const {user} = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate('/');
		}
	}, [user]);

	if (!user) {
		return (
			<>
				{children}
			</>
		);
	}
}
