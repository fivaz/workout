import { Outlet } from 'react-router';
import AuthProvider from '@/lib/auth/AuthProvider';
import { ExerciseProvider } from '@/lib/exercise/ExerciseProvider';

export default function AuthLayout() {
	return (
		<div>
			<AuthProvider>
				<ExerciseProvider>
					<Outlet />
				</ExerciseProvider>
			</AuthProvider>
		</div>
	);
}
