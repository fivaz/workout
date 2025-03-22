import type { ActionFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { commitSession, getSession } from '@/lib/session';

export async function action({ request }: ActionFunctionArgs) {
	const session = await getSession(request);
	session.unset('sessionCookie');
	session.unset('userId');

	return redirect('/login', {
		headers: {
			'Set-Cookie': await commitSession(session),
		},
	});
}

export default function Logout() {
	return null; // This could redirect automatically or show a logout button
}
