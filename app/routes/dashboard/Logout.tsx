import { type ActionFunctionArgs, Form, Link } from 'react-router';
import { redirect } from 'react-router';
import { destroySession, getSession } from '@/sessions.server';
import type { Route } from './+types/Logout';

export async function loader({ request }: Route.LoaderArgs) {
	const session = await getSession(request.headers.get('Cookie'));
	return redirect('/login', {
		headers: {
			'Set-Cookie': await destroySession(session),
		},
	});
}

export default function LogoutRoute() {
	return null;
}
