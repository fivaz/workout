import { NavLink, Outlet, useSearchParams } from 'react-router';
import AuthProvider from '@/lib/auth/AuthProvider';
import { ExerciseProvider } from '@/lib/exercise/ExerciseProvider';
import { ToastContainer } from 'react-toastify';
import { ClipboardListIcon, TimerIcon, TrophyIcon } from 'lucide-react';
import clsx from 'clsx';
import { ProgramProvider } from '@/lib/program/ProgramProvider';
import { ROUTES } from '@/lib/consts';

export default function AuthLayout() {
	const [searchParams] = useSearchParams();
	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1">
				<ToastContainer
					position="top-right"
					autoClose={1000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
				<AuthProvider>
					<ProgramProvider>
						<ExerciseProvider>
							<Outlet />
						</ExerciseProvider>
					</ProgramProvider>
				</AuthProvider>
			</main>
			<footer className="flex items-center p-3 border-t  dark:text-gray-300 text-gray-800 dark:bg-gray-900 bg-gray-100 border-gray-300 dark:border-gray-800">
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
			</footer>
		</div>
	);
}
