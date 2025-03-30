import { NavLink, useSearchParams } from 'react-router';
import { ROUTES } from '@/lib/consts';
import clsx from 'clsx';
import { ClipboardListIcon, CogIcon, TimerIcon, TrophyIcon } from 'lucide-react';

export default function Footer() {
	const [searchParams] = useSearchParams();
	return (
		<footer className="fixed bottom-0 left-0 right-0 flex items-center p-3 border dark:text-gray-300 text-gray-800 dark:bg-gray-900 bg-gray-100 border-gray-300 dark:border-gray-800 md:max-w-[700px] md:mx-auto">
			<NavLink
				to={`${ROUTES.PROGRAMS}?${searchParams.toString()}`}
				className={clsx('text-sm flex flex-col items-center flex-1')}
			>
				<ClipboardListIcon className="size-5" />
				Programs
			</NavLink>
			<NavLink
				to={`${ROUTES.HOME}?${searchParams.toString()}`}
				className={clsx('text-sm flex flex-col items-center flex-1')}
			>
				<TimerIcon className="size-5" />
				Train
			</NavLink>
			<NavLink
				to={`${ROUTES.STATS}?${searchParams.toString()}`}
				className={clsx('text-sm flex flex-col items-center flex-1')}
			>
				<TrophyIcon className="size-5" />
				Stats
			</NavLink>
			<NavLink
				to={`${ROUTES.SETTINGS}?${searchParams.toString()}`}
				className={clsx('text-sm flex flex-col items-center flex-1')}
			>
				<CogIcon className="size-5" />
				Settings
			</NavLink>
		</footer>
	);
}
