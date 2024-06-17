import {type Dispatch, type SetStateAction, type ReactNode} from 'react';

export type PopupContextType = {
	popup: string | undefined;
	setPopup: Dispatch<SetStateAction<string | undefined>>;
	popupActive: boolean;
	setPopupActive: Dispatch<SetStateAction<boolean>>;
};

export type PopupProviderProps = {
	children: ReactNode;
};
