import { Outlet } from 'react-router';
import AuthProvider from '@/lib/auth/AuthProvider';
import { ExerciseProvider } from '@/lib/exercise/ExerciseProvider';
import { ToastContainer } from 'react-toastify';

export default function AuthLayout() {
	return (
		<div>
			<ToastContainer />
			<AuthProvider>
				<ExerciseProvider>
					<Outlet />
				</ExerciseProvider>
			</AuthProvider>
		</div>
	);
}
