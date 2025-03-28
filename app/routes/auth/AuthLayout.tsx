import { NavLink, Outlet } from 'react-router';
import AuthProvider from '@/lib/auth/AuthProvider';
import { ExerciseProvider } from '@/lib/exercise/ExerciseProvider';
import { ToastContainer } from 'react-toastify';
import { ClipboardListIcon, TimerIcon, TrophyIcon } from 'lucide-react';
import clsx from 'clsx';

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
					<ExerciseProvider>
						<Outlet />
					</ExerciseProvider>
				</AuthProvider>
			</main>
			<footer className="flex justify-around items-center p-3 border-t">
				<NavLink to="/" className={clsx('text-sm flex flex-col items-center')}>
					<TimerIcon className="size-5" />
					Workout
				</NavLink>
				<NavLink to="/programs" className={clsx('text-sm flex flex-col items-center')}>
					<ClipboardListIcon className="size-5" />
					Programs
				</NavLink>
				<NavLink to="/stats" className={clsx('text-sm flex flex-col items-center')}>
					<TrophyIcon className="size-5" />
					Stats
				</NavLink>
			</footer>
		</div>
	);
}
