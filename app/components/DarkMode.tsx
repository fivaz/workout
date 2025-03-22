import { useState, useEffect } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Switch } from '@headlessui/react';

export default function DarkMode() {
	const [isDark, setIsDark] = useState(false);

	function getDarkMode(): boolean {
		return (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		);
	}

	useEffect(() => {
		// On mount
		const darkMode = getDarkMode();
		setIsDark(darkMode);
		document.documentElement.classList.toggle('dark', darkMode);
	}, []);

	useEffect(() => {
		// When isDark changes
		localStorage.theme = isDark ? 'dark' : 'light';
		document.documentElement.classList.toggle('dark', isDark);
	}, [isDark]);

	return (
		<Switch
			checked={isDark}
			onChange={setIsDark}
			className="relative inline-flex h-8 w-14 items-center rounded-full ring-2 ring-gray-500 transition-colors outline-none dark:focus:ring-white"
		>
			<span className="sr-only">Toggle Dark Mode</span>
			<span
				className={`absolute left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-all ${
					isDark ? 'left-7 bg-gray-800' : ''
				}`}
			>
				{isDark ? (
					<SunIcon className="size-5 text-yellow-500" aria-hidden="true" />
				) : (
					<MoonIcon className="size-5 text-blue-500" aria-hidden="true" />
				)}
			</span>
		</Switch>
	);
}
