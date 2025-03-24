import { type ActionFunctionArgs, Form, Link, NavLink } from 'react-router';
import { redirect } from 'react-router';
import { destroySession, getSession } from '@/sessions.server';
import type { Route } from './+types/Logout';
import { Button } from '@headlessui/react';
import GButton from '@/components/GButton';

export async function action({ request }: Route.ActionArgs) {
	const session = await getSession(request.headers.get('Cookie'));
	return redirect('/login', {
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
