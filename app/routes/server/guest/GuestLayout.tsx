import { data, Outlet, redirect } from 'react-router';
import { commitSession, getSession } from '@/sessions.server';
import { SERVER_ROUTES } from '@/lib/consts';
import type { Route } from './+types/GuestLayout';

export async function loader({ request }: Route.LoaderArgs) {
	const session = await getSession(request.headers.get('Cookie'));

	if (session.has('userId')) {
		// Redirect to the home page if they are already signed in.
		return redirect(SERVER_ROUTES.HOME);
	}

	return data(
		{ error: session.get('error') },
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	);
}

export default function GuestLayout() {
	return (
		<>
			<Outlet />
		</>
	);
}
