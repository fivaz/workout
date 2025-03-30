import { useState, useEffect } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Field, Label, Switch } from '@headlessui/react';
import { getDarkMode } from '@/components/DarkMode/darkMode.hook';
import GText from '@/components/GText';

export default function DarkModeSwitch({ label = false }: { label: boolean }) {
	const [isDark, setIsDark] = useState(getDarkMode());

	useEffect(() => {
		// When isDark changes
		localStorage.theme = isDark ? 'dark' : 'light';
		document.documentElement.classList.toggle('dark', isDark);
	}, [isDark]);

	return (
		<Field className="flex gap-4 items-center">
			{label && (
				<Label>
					<GText> {isDark ? 'dark' : 'light'}</GText>
				</Label>
			)}
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
		</Field>
	);
}
