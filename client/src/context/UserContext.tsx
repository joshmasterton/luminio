import {type UserProviderProps, type UserContextType} from '../types/context/UserContext.types';
import {type User} from '../types/utilities/request.types';
import {
	createContext, useContext, useEffect, useState,
} from 'react';
import {request} from '../utilities/requests';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error('Must useUser inside UserProvider');
	}

	return context;
};

export const UserProvider = ({children}: UserProviderProps) => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<User | undefined>(undefined);

	const getUser = async () => {
		try {
			const user = await request<undefined, User>('/user', 'GET');
			if (user) {
				setUser(user);
			} else {
				setUser(undefined);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
				setUser(undefined);
			}
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			await request('/logout', 'POST');
			await getUser();
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
	};

	useEffect(() => {
		getUser()
			.catch(error => {
				console.error(error);
			});
	}, []);

	if (loading) {
		return <div>Loading</div>;
	}

	return (
		<UserContext.Provider value={{user, setUser, logout}}>
			{children}
		</UserContext.Provider>
	);
};
