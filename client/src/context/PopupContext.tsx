import {
	createContext, useContext, useEffect, useState,
} from 'react';
import {type PopupProviderProps, type PopupContextType} from '../types/context/PopupContext.types';
import {MdError} from 'react-icons/md';
import '../styles/context/Popup.scss';

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
	const context = useContext(PopupContext);

	if (!context) {
		throw new Error('usePopup must be used within PopupProvider');
	}

	return context;
};

export const PopupProvider = ({children}: PopupProviderProps) => {
	const [popup, setPopup] = useState<string | undefined>(undefined);
	const [popupActive, setPopupActive] = useState(false);

	useEffect(() => {
		if (popup) {
			setPopupActive(true);
		}
	}, [popup]);

	return (
		<PopupContext.Provider value={{
			popup, setPopup, popupActive, setPopupActive,
		}}>
			{children}
		</PopupContext.Provider>
	);
};

export function Popup() {
	const {popup, setPopup, popupActive, setPopupActive} = usePopup();

	useEffect(() => {
		if (!popupActive) {
			setTimeout(() => {
				setPopup(undefined);
			}, 400);
		}
	}, [popupActive]);

	useEffect(() => {
		if (popup) {
			setPopupActive(true);
		}
	}, [popup]);

	return (
		<div id='popup' className={popupActive ? 'active' : 'hidden'}>
			<button type='button' aria-label='Close Popup' onClick={() => {
				setPopupActive(false);
			}}/>
			<div>
				<MdError/>
				<div>{popup}</div>
				<button type='button' className='primaryButton' onClick={() => {
					setPopupActive(false);
				}}>
					Close
				</button>
			</div>
		</div>
	);
}
