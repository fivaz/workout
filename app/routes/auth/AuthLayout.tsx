import { data, Form, Outlet, redirect, useNavigate } from 'react-router';
import AuthProvider from '@/lib/auth/authProvider';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase.client';
import type { Route } from './+types/AuthLayout';
import { getSession } from '@/sessions.server';
import { ROUTES } from '@/lib/consts';
import { Button } from '@headlessui/react';

export async function loader({ request }: Route.LoaderArgs) {
	const session = await getSession(request.headers.get('Cookie'));
	const userId = session.get('userId');

	if (!userId) {
		return redirect(ROUTES.LOGIN);
	}

	return data({ userId });
}

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
			<Form method="post" action={ROUTES.LOGOUT}>
				<Button type="submit">Logout</Button>
			</Form>
			<div className="h-screen">
				<Outlet />
			</div>
		</AuthProvider>
	);
}
