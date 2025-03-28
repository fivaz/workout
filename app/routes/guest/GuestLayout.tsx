import { Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase.client';
import { ROUTES } from '@/lib/consts';

export default function GuestLayout() {
	const navigate = useNavigate();
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
			if (user?.uid) {
				navigate(ROUTES.HOME);
			}
		});
		return () => unsubscribe();
	}, [navigate]);

	return (
		<>
			<Outlet />
		</>
	);
}
