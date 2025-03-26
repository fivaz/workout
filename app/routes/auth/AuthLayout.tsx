import { Outlet } from 'react-router';
import AuthProvider from '@/lib/auth/AuthProvider';

export default function AuthLayout() {
	return (
		<div>
			<AuthProvider>
				<Outlet />
			</AuthProvider>
		</div>
	);
}
