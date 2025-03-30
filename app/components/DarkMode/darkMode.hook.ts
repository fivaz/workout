import { useEffect } from 'react';

export function getDarkMode(): boolean {
	return (
		localStorage.theme !== 'light' ||
		(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
	);
}

export function useDarkMode() {
	useEffect(() => {
		// On mount
		const darkMode = getDarkMode();
		document.documentElement.classList.toggle('dark', darkMode);
	}, []);
}
