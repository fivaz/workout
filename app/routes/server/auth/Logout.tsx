import { Form, redirect } from 'react-router';
import { destroySession, getSession } from '@/sessions.server';
import type { Route } from './+types/Logout';
import GButton from '@/components/GButton';
import { SERVER_ROUTES } from '@/lib/consts';

export async function action({ request }: Route.ActionArgs) {
	const session = await getSession(request.headers.get('Cookie'));
	return redirect(SERVER_ROUTES.LOGIN, {
		headers: {
			'Set-Cookie': await destroySession(session),
		},
	});
}

export default function LogoutRoute() {
	return (
		<Form method="post">
			<GButton type="submit">Log out</GButton>
		</Form>
	);
}
