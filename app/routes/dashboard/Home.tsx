import { data, type LoaderFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { useLoaderData } from 'react-router';
// import { adminAuth } from '@/lib/firebase.server';
import type { Route } from './+types/Home';
import { getSession } from '@/sessions.server';

export async function loader({ request }: Route.LoaderArgs) {
	const session = await getSession(request.headers.get('Cookie'));

	if (!session.has('userId')) {
		// Redirect to the home page if they are already signed in.
		return redirect('/login');
	}

	return data({ userId: session.get('userId') });

	// try {
	// 	// const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
	// 	return { userId: decodedClaims.uid };
	// } catch (error) {
	// 	return redirect('/login');
	// }
}

export default function Home() {
	const { userId } = useLoaderData<typeof loader>();

	return (
		<div>
			<h1>Welcome, {userId}</h1>
			<a href="/logout">logout</a>
		</div>
	);
}
