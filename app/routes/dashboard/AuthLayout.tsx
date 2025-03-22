import { Outlet, redirect, useNavigate } from 'react-router';
import AuthProvider from '@/lib/auth/authProvider';
import isAuth from '@/lib/auth/useAuth';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase.client';

// export async function clientLoader() {
// 	// mock slow response from firebase
// 	await new Promise((resolve) =>
// 		setTimeout(() => {
// 			resolve(undefined);
// 		}, 2000),
// 	);
// 	const isLogged = await isAuth();
// 	if (!isLogged) {
// 		throw redirect('/');
// 	}
// }

export default function AuthLayout() {
	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) {
				navigate('/');
			}
		});

		return () => unsubscribe();
	}, [navigate]);

	return (
		<AuthProvider>
			<div className="h-screen bg-red-500">
				<Outlet />
			</div>
		</AuthProvider>
	);
}
