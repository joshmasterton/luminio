import {type ReactNode, type Dispatch, type SetStateAction} from 'react';
import {type User} from '../utilities/request.types';

export type UserContextType = {
	user: User | undefined;
	setUser: Dispatch<SetStateAction<User | undefined>>;
	logout: () => Promise<void>;
};

export type UserProviderProps = {
	children: ReactNode;
};
