import { NavLink, Outlet } from 'react-router';
import AuthProvider from '@/lib/auth/AuthProvider';
import { ExerciseProvider } from '@/lib/exercise/ExerciseProvider';
import { ToastContainer } from 'react-toastify';
import { ClipboardListIcon, TimerIcon, TrophyIcon } from 'lucide-react';
import clsx from 'clsx';
import { ProgramProvider } from '@/lib/program/ProgramProvider';
import { ROUTES } from '@/lib/consts';

export default function AuthLayout() {
	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1">
				<ToastContainer
					position="top-right"
					autoClose={5000}
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
			<footer className="flex justify-around items-center p-3 border-t  dark:text-gray-300 text-gray-800 dark:bg-gray-900 bg-gray-100 border-gray-300 dark:border-gray-800">
				<NavLink to={ROUTES.HOME} className={clsx('text-sm flex flex-col items-center')}>
					<TimerIcon className="size-5" />
					Train
				</NavLink>
				<NavLink to={ROUTES.PROGRAMS} className={clsx('text-sm flex flex-col items-center')}>
					<ClipboardListIcon className="size-5" />
					Programs
				</NavLink>
				<NavLink to={ROUTES.STATS} className={clsx('text-sm flex flex-col items-center')}>
					<TrophyIcon className="size-5" />
					Stats
				</NavLink>
			</footer>
		</div>
	);
}
