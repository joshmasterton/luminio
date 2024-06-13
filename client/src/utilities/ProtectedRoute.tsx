import {useEffect, type ReactNode} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUser} from '../context/UserContext';

export function ProtectedRoute({children}: {children: ReactNode}) {
	const {user} = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user]);

	if (user) {
		return (
			<>
				{children}
			</>
		);
	}
}
